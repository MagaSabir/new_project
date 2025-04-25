import request from "supertest";
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {STATUS_CODE} from "../src/core/http-statuses-code";
import {runDb} from "../src/db/mongoDb";
const auth = `Basic ${Buffer.from(`${SETTINGS.ADMIN_AUTH}`).toString('base64')}`
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

const createPost = async (overrides: Object = {}) => {
    const post = {
        title: 'post1',
        shortDescription: 'desc1',
        content: 'content1',
        ...overrides
    }
    const response = await request(app)
        .post('/posts')
        .set('Authorization', auth)
        .send(post)
    return response.body
}
describe('/posts tests', () => {
    beforeAll(async () => {
        await runDb()
    })

    beforeEach(async () => {
        await request(app).delete(SETTINGS.PATH.cleanDB)
    })
    describe('GET/ posts', () => {
        it('should return empty posts', async () => {
            const res = await request(app)
                .get('/posts')
                .expect(STATUS_CODE.OK_200)
            expect(res.body).toEqual({
                pagesCount: expect.any(Number),
                page: expect.any(Number),
                pageSize: expect.any(Number),
                totalCount: 0,
                items: []
            })
        });

        it('should return list posts', async () => {
            const createdBlog = await createBlog({name:'blog'})
            const createdPost1 = await createPost({title: 'post1',blogId: createdBlog.id})
            const createdPost2 = await createPost({title: 'post2', blogId: createdBlog.id})

            const res = await request(app)
                .get('/posts')
                .expect(STATUS_CODE.OK_200)
            expect(res.body).toEqual({
                pagesCount: expect.any(Number),
                page: expect.any(Number),
                pageSize: expect.any(Number),
                totalCount: expect.any(Number),
                items: expect.arrayContaining([
                    expect.objectContaining({
                    id: createdPost1.id,
                    title: 'post1',
                    shortDescription: createdPost1.shortDescription,
                    content: createdPost1.content,
                    blogId: createdBlog.id,
                    blogName: createdBlog.name,
                    createdAt: expect.any(String)
                }),
                    expect.objectContaining({
                        id: createdPost2.id,
                        title: 'post2',
                        shortDescription: createdPost2.shortDescription,
                        content: createdPost2.content,
                        blogId: createdBlog.id,
                        blogName: createdBlog.name,
                        createdAt: expect.any(String)
                    })
                ])
            })
        });

        it('should return post by id', async () => {
            const createdBlog = await createBlog({name:'blog'})
            const createdPost = await createPost({blogId: createdBlog.id, title: 'post2'})
            const res = await request(app)
                .get(`/posts/${createdPost.id}`)
                .expect(STATUS_CODE.OK_200)
            expect(res.body).toEqual({
                id: createdPost.id,
                title: 'post2',
                shortDescription: createdPost.shortDescription,
                content: createdPost.content,
                blogId: createdBlog.id,
                blogName: createdBlog.name,
                createdAt: expect.any(String)
            })
        });
    })

    describe('POST / create posts', () => {
        it('should create new post and return', async () => {
            const createdBlog = await createBlog()
            const res = await request(app)
                .post(SETTINGS.PATH.posts)
                .set('Authorization', auth)
                .send({
                    title: 'post1',
                    shortDescription: 'desc1',
                    content: 'content',
                    blogId: createdBlog.id
                })
                .expect(STATUS_CODE.CREATED_201)
            expect(res.body).toMatchObject({
                id: expect.any(String),
                title: 'post1',
                blogId: createdBlog.id
            })
        });
    })
})