import request from "supertest";
import {app} from "../app";
import {SETTINGS} from "../settings";
import {STATUS_CODE} from "../common/adapters/http-statuses-code";
import {runDb} from "../db/mongoDb";
import {auth, creator,} from './helpers/helper.e2e.helper'
import jwt from "jsonwebtoken";
import {jwtService} from "../common/adapters/jwt.service";


describe('/posts tests', () => {
    let blogId: string
    beforeAll(async () => {
        await runDb()
        blogId = (await creator.createBlog()).id
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
            const createdBlog = await creator.createBlog({name:'blog'})
            const createdPost1 = await creator.createPost({title: 'post1',blogId: createdBlog.id})
            const createdPost2 = await creator.createPost({title: 'post2', blogId: createdBlog.id})

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
            const createdBlog = await creator.createBlog({name:'blog'})
            const createdPost = await creator.createPost({blogId: createdBlog.id, title: 'post2'})
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
            const createdBlog = await creator.createBlog()
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

    describe('PUT /update post and check updated post', () => {
        it('should update post', async () => {
            const createdBlog = await creator.createBlog()
            const createdPost = await creator.createPost({blogId: createdBlog.id})
              await request(app)
                .put(`${SETTINGS.PATH.posts}/${createdPost.id}`)
                .set('Authorization', auth)
                .send({
                    title: 'updated',
                    shortDescription: 'desc',
                    content: 'cont',
                    blogId: createdBlog.id
                })
                .expect(STATUS_CODE.NO_CONTENT_204)

            const res2 = await request(app)
                .get(`${SETTINGS.PATH.posts}/${createdPost.id}`)
                .expect(STATUS_CODE.OK_200)
            expect(res2.body).toMatchObject({id: res2.body.id, title: 'updated',})

        });
    })

    describe('DELETE /post', () => {
        it('should delete post by id', async () => {
            const createdBlog = await creator.createBlog()
            const createdPost = await creator.createPost({blogId: createdBlog.id})
            const res = await request(app)
                .delete(`${SETTINGS.PATH.posts}/${createdPost.id}`)
                .set('Authorization', auth)
                .expect(STATUS_CODE.NO_CONTENT_204)
            expect(res.body).toEqual({})
        });
    })

    describe('POST /post{id}comments', () => {
        it('should create comments by postId and return created comment. Before all should create user and login.', async () => {
            const user = await creator.createUser()
            const blog = await creator.createBlog()
            const post = await creator.createPost({blogId: blog.id})
            const response = await request(app)
                .post(`${SETTINGS.PATH.auth}/login`)
                .send({
                    loginOrEmail: 'user123',
                    password: 'string'
                })
                .expect(STATUS_CODE.OK_200)
            const accessToken = response.body.accessToken
            expect(accessToken).toBeDefined()

            const secondResponse = await request(app)
                .post(`${SETTINGS.PATH.posts}/${post.id}/comments`)
                .set('Authorization', `Bearer ${accessToken}`)
                .send({content: 'Some long text with many symbols'})
                .expect(201)
            expect(secondResponse.body).toEqual({
                    id: expect.any(String),
                    content: secondResponse.body.content,
                    commentatorInfo: {
                        userId: user.id,
                        userLogin: user.login
                    },
                    createdAt: expect.any(String)
            })
        });
    })

    //Invalid input data

    describe('POST /posts', () => {
        it('should return 400 with error messages if input data has incorrect values', async ()  => {
            let createdPost = await creator.createPost({blogId: blogId, title:''})

            const responseWithTitle = await request(app)
                .post(SETTINGS.PATH.posts)
                .set('Authorization', auth)
                .send(createdPost)
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(responseWithTitle.body).toEqual(creator.err('title'))
        });

        it('should return 400 with error if field `ShortDescription` - has a incorrect value', async () => {
            const createdPost = await creator.createPost({shortDescription: '', blogId: blogId})
            const responseWithShortDesc = await request(app)
                .post(SETTINGS.PATH.posts)
                .set('Authorization', auth)
                .send(createdPost)
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(responseWithShortDesc.body).toEqual(creator.err('shortDescription'))
        });

        it('should return 400 with error if field `content` - has a incorrect value', async () => {
            const createdPost = await creator.createPost({content: '', blogId: blogId})
            const responseWithContent = await request(app)
                .post(SETTINGS.PATH.posts)
                .set('Authorization', auth)
                .send(createdPost)
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(responseWithContent.body).toEqual(creator.err('content'))
        });

        it('should return 400 with error if field `blogID` - has a incorrect value', async () => {
            const createdPost = await creator.createPost()
            const responseWithBlogId = await request(app)
                .post(SETTINGS.PATH.posts)
                .set('Authorization', auth)
                .send(createdPost)
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(responseWithBlogId.body).toEqual(creator.err('blogId'))
        });

        it('should return 400 with errors if all fields  has  incorrect values', async () => {
            const createdPost = await creator.createPost({title: '', shortDescription: '', content: '', blogId: ''})
            const responseWithBlogId = await request(app)
                .post(SETTINGS.PATH.posts)
                .set('Authorization', auth)
                .send(createdPost)
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(responseWithBlogId.body).toEqual({
                errorsMessages: [{
                    field: 'blogId',
                    message: expect.any(String)
                },
                    {
                        field: 'title',
                        message: expect.any(String)
                    },
                    {
                        field: 'shortDescription',
                        message: expect.any(String)
                    },
                    {
                        field: 'content',
                        message: expect.any(String)
                    }]
            })
        });

        it('should return 400 with error if title has maxLength > 30 symbols', async () => {
            const response = await request(app)
                .post(SETTINGS.PATH.posts)
                .set('Authorization', auth)
                .send({
                    title: "a".repeat(31),
                    shortDescription: "desc",
                    content: 'content',
                    blogId: blogId
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(response.body).toEqual(creator.err('title'))
        });

        it('should return 400 with error if field shortDescription length > 100 symbols', async () => {
            const response = await request(app)
                .post(SETTINGS.PATH.posts)
                .set('Authorization', auth)
                .send({
                    title: 'valid Title',
                    shortDescription: 'a'.repeat(101),
                    content: 'valid',
                    blogId: blogId
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(response.body).toEqual(creator.err('shortDescription'))
        });

        it('should return 400 with error if field content length > 1000 symbols', async () => {
            const response = await request(app)
                .post(SETTINGS.PATH.posts)
                .set('Authorization', auth)
                .send({
                    title: 'valid Title',
                    shortDescription: 'valid',
                    content: 'a'.repeat(1001),
                    blogId: blogId
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(response.body).toEqual(creator.err('content'))
        });

        it('should return 400 with error if field blogId is empty', async () => {
            const response = await request(app)
                .post(SETTINGS.PATH.posts)
                .set('Authorization', auth)
                .send({
                    title: 'valid Title',
                    shortDescription: 'valid',
                    content: 'a'.repeat(1001),
                    blogId: ''
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(response.body).toEqual(creator.err('blogId'))
        });
    })

    describe('PUT =>/posts', () => {

        it('should return 400 with error request with incorrect values', async () => {
            const createdPost = await creator.createPost({title: '', blogId: blogId})

            const response = await request(app)
                .put(`${SETTINGS.PATH.posts}/111`)
                .set('Authorization', auth)
                .send(createdPost)
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(response.body).toEqual(creator.err('title'))

        });

        it('should return 400 with error request with incorrect values', async () => {
            const createdPost = await creator.createPost({shortDescription: '', blogId: blogId})

            const response = await request(app)
                .put(`${SETTINGS.PATH.posts}/${createdPost.id}`)
                .set('Authorization', auth)
                .send(createdPost)
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(response.body).toEqual(creator.err('shortDescription'))

        });

        it('should return 400 with error request with incorrect values', async () => {
            const createdPost = await creator.createPost({content: '', blogId: blogId})

            const response = await request(app)
                .put(`${SETTINGS.PATH.posts}/111`)
                .set('Authorization', auth)
                .send(createdPost)
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(response.body).toEqual(creator.err('content'))

        });
    })
    
    describe('DELETE =>/posts', () => {
        it('should return Unauthorized', async () => {

            await request(app)
                .delete(`${SETTINGS.PATH.posts}/12121}`)
                expect(STATUS_CODE.UNAUTHORIZED_401)
        });

        it('should delete post by id', async () => {
            const blog = await creator.createBlog();
            const post = await creator.createPost({blogId: blog.id});
            await request(app)
                .delete(`${SETTINGS.PATH.posts}/${post.id}`)
                .set('Authorization', auth)
                .expect(STATUS_CODE.NO_CONTENT_204)
        });
    })
})