import {auth, creator} from "./helpers/helpers.e2e.helper";
import request from "supertest";
import {app} from "../app";
import {SETTINGS} from "../settings";
import {STATUS_CODE} from "../common/adapters/http-statuses-code";
import {runDb} from "../db/mongoDb";
import {jwtService} from "../common/adapters/jwt.service";

describe('tests', () => {
    beforeAll(async () => {
        await runDb();
    });
    let token: string;

    it('should create user and login', async () => {
        const res = await request(app)
            .post('/auth/login')
            .set('User-Agent', 'mobile')
            .send({
                loginOrEmail: 'user1',
                password: 'string'
            })
            .expect(200)

        const res2 = await request(app)
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



    })

    it('should update refresh token device 1', async () => {
        const response = await request(app)
            .get('/security/devices')
            .expect(200)
        console.log(response.body)
    });
})