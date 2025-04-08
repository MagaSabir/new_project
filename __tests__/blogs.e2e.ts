import request from 'supertest';
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {STATUS_CODE} from "../src/core/http-statuses-code";


describe('/blogs', () => {


    const auth = `Basic ${Buffer.from(`${SETTINGS.ADMIN_AUTH}`)
        .toString('base64')}`

    beforeAll(async () => {
        await request(app).delete(SETTINGS.PATH.cleanDB)
    })

    it('should return 200 and empty array', async () => {
        await request(app)
            .get('/blogs')
            .expect(200, [])
    });

    it('should create blogs with correct input data', async () => {

        const response = await request(app)
            .post('/blogs')
            .set('Authorization', auth)
            .send({
                name: "string",
                description: "string",
                websiteUrl: "goooogle.ru",
            })
            .expect(STATUS_CODE.CREATED_201)

        const blog = response.body
        expect(blog).toEqual({
            id: expect.any(String),
            name: "string",
            description: "string",
            websiteUrl: "goooogle.ru",
        })
        await request(app)
            .get('/blogs')
            .expect(STATUS_CODE.OK_200, [blog])
    });

})