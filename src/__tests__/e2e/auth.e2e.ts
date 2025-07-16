import {creator} from "../helpers/helpers.e2e.helper";
import request from "supertest";
import {app} from "../../app";
import {NextFunction} from "express";
import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server-core";

jest.mock('../../common/middlewares/rateLimit.middleware', () => ({
    rateLimitMiddleware: (req: Request, res: Response, next: NextFunction) => next()
}))
 let mongo: MongoMemoryServer;
describe('tests', () => {
    beforeAll(async () => {

        mongo = await MongoMemoryServer.create()
        const mongoUri = mongo.getUri()
        await mongoose.connect(mongoUri)
    });

    beforeEach(async () => {
        const collections = await mongoose.connection.db!.collections()
        await Promise.all(
            collections.map(collection => collection.deleteMany())
        )
    })

    afterAll(async () => {
        await mongo.stop()
        await mongoose.connection.close()
    })
    let refreshToken;

    it('should create user and login', async () => {

        await creator.createUser({login: 'user1', email: 'test@test1.com'})
        await creator.createUser({login: 'user2', email: 'test@test2.com'})

        const user2 = await request(app)
            .post('/auth/login')
            .set('User-Agent', 'mobile')
            .send({
                loginOrEmail: 'user2',
                password: 'string'
            })
            .expect(200)

        await request(app)
            .post('/auth/login')
            .set('User-Agent', 'mobile')
            .send({
                loginOrEmail: 'user2',
                password: 'string'
            })
            .expect(200)

        refreshToken = user2.headers['set-cookie']

        await request(app)
            .post('/auth/login')
            .set('User-Agent', 'mobile2')
            .send({
                loginOrEmail: 'user1',
                password: 'string'
            })
            .expect(200)

        await request(app)
            .post('/auth/login')
            .set('User-Agent', 'desktop')
            .send({
                loginOrEmail: 'user1',
                password: 'string'
            })
            .expect(200)
        await request(app)
            .post('/auth/login')
            .set('User-Agent', 'laptop')
            .send({
                loginOrEmail: 'user1',
                password: 'string'
            })
            .expect(200)

        await request(app)
            .post('/auth/login')
            .set('User-Agent', 'laptop')
            .send({
                loginOrEmail: 'user1',
                password: 'string'
            })
            .expect(200)


        const response = await request(app)
            .get('/security/devices')
            .set('Cookie', refreshToken)
            .expect(200)
        expect(response.body).toHaveLength(2)

        await request(app)
            .delete('/security/devices')
            .set('Cookie', refreshToken)
            .expect(204)

        const response2 = await request(app)
            .get('/security/devices')
            .set('Cookie', refreshToken)
            .expect(200)
        expect(response2.body).toHaveLength(2)
        console.log(response2.headers['Cookies'])
    })
})