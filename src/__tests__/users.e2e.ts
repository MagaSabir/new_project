import {runDb} from "../db/mongoDb";
import request from "supertest";
import {app} from "../app";
import {SETTINGS} from "../settings";
import {auth} from "../common/adapters/helper.e2e.helper";
import {STATUS_CODE} from "../common/adapters/http-statuses-code";


describe('/users tests', () => {
    beforeAll(async () => {
        await runDb()
    })

    beforeEach(async () => {
        await request(app).delete(SETTINGS.PATH.cleanDB)
    })


    afterAll(async () => {
        await request(app).delete(SETTINGS.PATH.cleanDB)
    })
    describe('POST/ -> users', () => {
        it('should create and return new confirmed user', async () => {
            const firstUser = {
                login: 'User1',
                password: 'qwerty123',
                email: 'example@example.com'
            }
            const res = await request(app)
                .post(SETTINGS.PATH.users)
                .set('Authorization', auth)
                .send(firstUser)
                 .expect(STATUS_CODE.CREATED_201)
            expect(res.body).toEqual({
                id: expect.any(String),
                login: firstUser.login,
                email: firstUser.email,
                createdAt: expect.any(String),
            })
        });

        it('should return users', async () => {
            const userForReturn = {
                login: 'User1',
                password: 'qwerty123',
                email: 'example@example.com'
            }
            await request(app)
                .post(SETTINGS.PATH.users)
                .set('Authorization', auth)
                .send(userForReturn)
                .expect(STATUS_CODE.CREATED_201)
            const res = await request(app)
                .get(SETTINGS.PATH.users)
                .set('Authorization', auth)
                .expect(STATUS_CODE.OK_200)

            expect(res.body).toEqual({
                pagesCount: expect.any(Number),
                page: expect.any(Number),
                pageSize: expect.any(Number),
                totalCount: expect.any(Number),
                items: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        login: userForReturn.login,
                        email: userForReturn.email,
                        createdAt: expect.any(String),
                    })
                ])
            })
        });
        //Invalid Data

        it('should return 400 if user with same login already exists', async () => {

            const firstUser = {
                login: 'User1',
                password: 'qwerty123',
                email: 'example@example.com'
            }

            const secondUser = {
                login: 'User1',
                password: 'qwerty123',
                email: 'example2@example2.com'
            }

             await request(app)
                .post(SETTINGS.PATH.users)
                .set('Authorization', auth)
                .send(firstUser)
                .expect(STATUS_CODE.CREATED_201)

            const res = await request(app)
                .post(SETTINGS.PATH.users)
                .set('Authorization', auth)
                .send(secondUser)
                .expect(STATUS_CODE.BAD_REQUEST_400)
            console.log(res.body)
            expect(res.body).toMatchObject({
                errorsMessages: expect.arrayContaining([
                    expect.objectContaining({
                        message: 'already exists',
                        field: 'loginOrEmail'
                    })
                ])
            })
        });

        it('should return 400 if user with same email already exists', async () => {

            const firstUser = {
                login: 'User1',
                password: 'qwerty123',
                email: 'example@example.com'
            }

            const secondUser = {
                login: 'User2',
                password: 'qwerty123',
                email: 'example@example.com'
            }

            await request(app)
                .post(SETTINGS.PATH.users)
                .set('Authorization', auth)
                .send(firstUser)
                .expect(STATUS_CODE.CREATED_201)

            const res = await request(app)
                .post(SETTINGS.PATH.users)
                .set('Authorization', auth)
                .send(secondUser)
                .expect(STATUS_CODE.BAD_REQUEST_400)
            console.log(res.body)
            expect(res.body).toMatchObject({
                errorsMessages: expect.arrayContaining([
                    expect.objectContaining({
                        message: 'already exists',
                        field: 'loginOrEmail'
                    })
                ])
            })
        });
    })
})