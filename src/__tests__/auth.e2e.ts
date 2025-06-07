import {auth, creator} from "./helpers/helpers.e2e.helper";
import request from "supertest";
import {app} from "../app";
import {SETTINGS} from "../settings";
import {STATUS_CODE} from "../common/adapters/http-statuses-code";
import {db, runDb} from "../db/mongoDb";
import {jwtService} from "../common/adapters/jwt.service";
import {rateLimitMiddleware} from "../common/middlewares/rateLimit.middleware";
import {NextFunction} from "express";

jest.mock('../common/middlewares/rateLimit.middleware', () => ({
    rateLimitMiddleware: (req: Request, res: Response, next: NextFunction) => next()
}))

describe('tests', () => {
    beforeAll(async () => {
        await runDb();
        await db.collection('sessions').deleteMany()
    });

    afterAll(async () => {
        await db.collection('users').deleteMany()

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
            .set('User-Agent', 'mobile')
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
        console.log(response.body)

        await request(app)
            .delete('/security/devices')
            .set('Cookie', refreshToken)
            .expect(204)

        const response2 = await request(app)
            .get('/security/devices')
            .set('Cookie', refreshToken)
            .expect(200)
        expect(response2.body).toHaveLength(1)
    })
})