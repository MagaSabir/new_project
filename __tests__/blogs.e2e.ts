import request from 'supertest';
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {STATUS_CODE} from "../src/core/http-statuses-code";
import {describe} from "node:test";


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

        it('GET / should return list blogs', async () => {
            const createdBlog1 = await createBlog({name: 'blog1'})
            const createdBlog2 = await createBlog({name: 'blog2'})

            const res = await request(app)
                .get('/blogs')
                .expect(STATUS_CODE.OK_200)
            expect(res.body).toEqual({
                pagesCount: expect.any(Number),
                page: expect.any(Number),
                pageSize: expect.any(Number),
                totalCount: 2,
                items: expect.arrayContaining([
                    expect.objectContaining({
                        id: createdBlog1.id,
                        name: 'blog1',
                    }),
                    expect.objectContaining({
                        id: createdBlog2.id,
                        name: 'blog2',
                    })
                ])
            })
        });

        it('GET:/id /should return blog by id', async () => {
            const createdBlog = await createBlog({name: 'byId'})
            const res = await request(app)
                .get(`/blogs/${createdBlog.id}`)
                .expect(STATUS_CODE.OK_200)
            expect(res.body).toMatchObject({id: createdBlog.id})

        });


        it(`GET:/id /shouldn't return blog`, async () => {
            await request(app)
                .get(`/blogs/${10}`)
                .expect(STATUS_CODE.NOT_FOUND_404)
        });

    })

    describe('POST /blogs', () => {
        it('POST /should create new blog', async () => {
            const res = await request(app)
                .post('/blogs')
                .set('Authorization', auth)
                .send({
                    name: 'blog3',
                    description: 'desc3',
                    websiteUrl: 'https://site.com'
                })
                .expect(STATUS_CODE.CREATED_201)
            expect(res.body).toMatchObject({
                id: expect.any(String),
                name: 'blog3',
                description: 'desc3',
                websiteUrl: 'https://site.com',
                createdAt: expect.any(String),
                isMembership: false
            })
        });
    })

    describe('PUT /blogs', () => {
        it('PUT:/id /should update blog', async () => {
            const createdBlog = await createBlog({name: 'UpdatedBlog'})
             await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 'UpdatedBlog',
                    description: 'desc4',
                    websiteUrl: 'https://site.com',
                })
                .expect(STATUS_CODE.NO_CONTENT_204)
            const res = await request(app)
                .get(`/blogs/${createdBlog.id}`)
                .expect(STATUS_CODE.OK_200)
            expect(res.body).toMatchObject({
                id: createdBlog.id,
                name: 'UpdatedBlog',
                description: 'desc4',
                websiteUrl: 'https://site.com',
                createdAt: expect.any(String),
                isMembership: false
            })
        })
    })

    describe('DELETE /blogs', () => {
        it('POST-> GET-> DELETE /should create a blog, check it exists, and delete it', async () => {
            const createdBlog = await createBlog({name: 'deletedBlog'})
             await request(app)
                .get(`/blogs/${createdBlog.id}`)
                .expect(STATUS_CODE.OK_200)
             await request(app)
                .delete(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .expect(STATUS_CODE.NO_CONTENT_204)
            await request(app)
                .get(`/blogs/${createdBlog.id}`)
                .expect(STATUS_CODE.NOT_FOUND_404)
        });
    })
})