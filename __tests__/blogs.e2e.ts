import request from 'supertest';
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {STATUS_CODE} from "../src/core/http-statuses-code";


const auth = `Basic ${Buffer.from(`${SETTINGS.ADMIN_AUTH}`)
    .toString('base64')}`



const createBlog = async (overrides ={}) => {
    const blog = {
        name: 'name1',
        description: 'desc1',
        websiteUrl: 'https://site.com',
        ...overrides
    }
    const response = await request(app)
        .post('/blogs')
        .set('Authorization', auth)
        .send(blog)

    return response.body
}

describe('/blogs tests', () => {
    beforeAll(async () => {
        await request(app).delete(SETTINGS.PATH.cleanDB)
    })

    describe('GET /blogs', () => {
        it('should return empty list', async () => {
            const res = await request(app)
                .get('/blogs')
                .expect(STATUS_CODE.OK_200)
            expect(res.body).toEqual({
                pagesCount: expect.any(Number),
                page: expect.any(Number),
                pageSize: expect.any(Number),
                totalCount: 0,
                items: []
            })
        })

        it('should return created blogs', async () => {
            const blog1 = await createBlog({name: "blog1"})
            const blog2 = await createBlog({name: "blog2"})

            const res = await request(app)
                .get('/blogs')
                .expect(STATUS_CODE.OK_200)

            expect(res.body.items).toEqual(
                expect.arrayContaining([
                    expect.objectContaining({id: blog1.id, name: 'blog1'}),
                    expect.objectContaining({id: blog2.id, name: 'blog2'})
                ])
            )
        })

    })
})