import request from 'supertest';
import {app} from "../../app";
import {STATUS_CODE} from "../../common/adapters/http-statuses-code";
import {faker} from "@faker-js/faker/locale/ar";
import {auth, creator,} from "../helpers/helpers.e2e.helper";
import mongoose from "mongoose";

import {MongoMemoryServer} from "mongodb-memory-server-core";

let mongo: MongoMemoryServer
describe('/blogs tests', () => {


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
            const createdBlog1 = await creator.createBlog({name: 'blog1'})
            const createdBlog2 = await creator.createBlog({name: 'blog2'})
            const createdBlog3 = await creator.createBlog({name: 'log'})
            const res = await request(app)
                .get('/blogs')
                .expect(STATUS_CODE.OK_200)
            expect(res.body).toEqual({
                pagesCount: expect.any(Number),
                page: expect.any(Number),
                pageSize: expect.any(Number),
                totalCount: 3,
                items: expect.arrayContaining([
                    expect.objectContaining({
                        id: createdBlog1.id,
                        name: 'blog1',
                        description: expect.any(String),
                        websiteUrl: expect.any(String),
                        createdAt: expect.any(String),
                        isMembership: false
                    }),
                    expect.objectContaining({
                        id: createdBlog2.id,
                        name: 'blog2',
                        description: expect.any(String),
                        websiteUrl: expect.any(String),
                        createdAt: expect.any(String),
                        isMembership: false
                    }),
                    expect.objectContaining({
                        id: createdBlog3.id,
                        name: 'log',
                        description: expect.any(String),
                        websiteUrl: expect.any(String),
                        createdAt: expect.any(String),
                        isMembership: false
                    })
                ])
            })
        });

        it('GET:/id /should return blog by id', async () => {
            const createdBlog = await creator.createBlog({name: 'byId'})
            const res = await request(app)
                .get(`/blogs/${createdBlog.id}`)
                .expect(STATUS_CODE.OK_200)
            expect(res.body).toMatchObject({id: createdBlog.id})

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
            const createdBlog = await creator.createBlog({name: 'UpdatedBlog'})
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
            const createdBlog = await creator.createBlog({name: 'deletedBlog'})
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


    //Тесты с некорректными значениями
    describe('POST /blogs - with invalid input', () => {
        it('should return 400 with errors messages if input has incorrect values', async () => {
            const res = await request(app)
                .post('/blogs')
                .set('Authorization', auth)
                .send({
                    name: '',
                    description: '',
                    websiteUrl: '',
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res.body).toMatchObject({
                errorsMessages: expect.arrayContaining([{
                    field: 'name',
                    message: expect.any(String)
                },
                    {
                        field: 'description',
                        message: expect.any(String)
                    },
                    {
                        field: 'websiteUrl',
                        message: expect.any(String)
                    }
                ])
            })
        });

        it(`should return 400 with error messages if field "websiteUrl" contains incorrect value`, async () => {
            const res = await request(app)
                .post('/blogs')
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: 'desc',
                    websiteUrl: '',
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)

            expect(res.body).toMatchObject(creator.err('websiteUrl'))
        });


        it(`should return 400 with error messages if field "name" contains incorrect value`, async () => {
            const res = await request(app)
                .post('/blogs')
                .set('Authorization', auth)
                .send({
                    name: '',
                    description: 'desc',
                    websiteUrl: 'https://site.com',
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)

            expect(res.body).toMatchObject({
                errorsMessages: expect.arrayContaining([{
                    field: 'name',
                    message: expect.any(String)
                }
                ])
            })
        });

        it(`should return 400 with error messages if field "description" contains incorrect value`, async () => {
            const res = await request(app)
                .post('/blogs')
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: '',
                    websiteUrl: 'https://site.com',
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)

            expect(res.body).toMatchObject(creator.err('description'))
        });

        it('should return 401 if user is not authorized', async () => {
            await request(app)
                .post('/blogs')
                .set('NotAuth', auth)
                .expect(STATUS_CODE.UNAUTHORIZED_401)
        });
    })

    describe('GET /blogs - with not exists id', () => {
        it('should return 404 if specified blog is not exists', async () => {
            await request(app)
                .get(`/blogs/${expect.any(String)}`)
                .expect(STATUS_CODE.NOT_FOUND_404)
        });
    })

    describe('PUT /blogs - with invalid input', () => {
        it('should return 401 if user is not authorized', async () => {
            await request(app)
                .put('/blogs/1')
                .set('notAuth', auth)
                .expect(STATUS_CODE.UNAUTHORIZED_401)
        });

        it('should return  404 if id is not exists', async () => {
            await request(app)
                .get(`/blogs/${100}`)
                .expect(STATUS_CODE.NOT_FOUND_404)
        });

        it(`should return 400 with error messages if field "name" contains incorrect value`, async () => {
            const createdBlog = await creator.createBlog()
            const res = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: '',
                    description: 'desc',
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res.body).toEqual(creator.err('name'))

            const res2 = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 1,
                    description: 'desc',
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res2.body).toEqual(creator.err('name'))

            const res3 = await request(app)

                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: faker.string.alphanumeric(16),
                    description: 'desc',
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res3.body).toEqual(creator.err('name'))
        });

        it(`should return 400 with error messages if field "description" contains incorrect value`, async () => {
            const createdBlog = await creator.createBlog()
            const res = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: '',
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res.body).toEqual(creator.err('description'))

            const res2 = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: 12,
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res2.body).toEqual(creator.err('description'))

            const res3 = await request(app)

                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: faker.string.alphanumeric(501),
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res3.body).toEqual(creator.err('description'))
        });

        it(`should return 400 with error messages if field "websiteUrl" contains incorrect value`, async () => {
            const createdBlog = await creator.createBlog()
            const res = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: 'description',
                    websiteUrl: ''
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res.body).toEqual(creator.err('websiteUrl'))

            const res2 = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: 'description',
                    websiteUrl: 'http://site'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res2.body).toEqual(creator.err('websiteUrl'))
        });
    })
})

