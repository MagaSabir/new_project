import request from 'supertest';
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";
import {STATUS_CODE} from "../src/core/http-statuses-code";
import {faker} from "@faker-js/faker/locale/ar";
import {testClient} from "../src/db/mongoDb";


const auth = `Basic ${Buffer.from(`${SETTINGS.ADMIN_AUTH}`)
    .toString('base64')}`

const err = (field: string) => {
    return {
        errorsMessages: expect.arrayContaining([{
            field: field,
            message: expect.any(String)
        }])
    }
}


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
        await testClient.connect()
        console.log('testDB')
    })
    beforeEach(async () => {
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

    
    //Тесты  с некорректными  значениями
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
            console.log(res.body)
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
                ])})
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

            expect(res.body).toMatchObject(err('websiteUrl'))
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

            expect(res.body).toMatchObject(err('description'))
        });

        it('should return 401 if user is not authorized',  async () => {
            await request(app)
                .post('/blogs')
                .set('NotAuth', auth)
                .expect(STATUS_CODE.UNAUTHORIZED_401)
        });
    })

    describe('GET /blogs - with not exists id', () => {
        it('should return 404 if specified blog is not exists', async () => {
            await request(app)
                .get(`/blogs/${100}`)
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
            const createdBlog = await createBlog()
            const res = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: '',
                    description: 'desc',
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res.body).toEqual(err('name'))

            const res2 = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 1,
                    description: 'desc',
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res2.body).toEqual(err('name'))

            const res3 = await request(app)

                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: faker.string.alphanumeric(16),
                    description: 'desc',
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            console.log(faker.string.alphanumeric(40))
            expect(res3.body).toEqual(err('name'))
        });

        it(`should return 400 with error messages if field "description" contains incorrect value`, async () => {
            const createdBlog = await createBlog()
            const res = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: '',
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res.body).toEqual(err('description'))

            const res2 = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: 12,
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res2.body).toEqual(err('description'))

            const res3 = await request(app)

                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: faker.string.alphanumeric(501),
                    websiteUrl: 'http://site.com'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res3.body).toEqual(err('description'))
        });

        it(`should return 400 with error messages if field "websiteUrl" contains incorrect value`, async () => {
            const createdBlog = await createBlog()
            const res = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: 'description',
                    websiteUrl: ''
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res.body).toEqual(err('websiteUrl'))

            const res2 = await request(app)
                .put(`/blogs/${createdBlog.id}`)
                .set('Authorization', auth)
                .send({
                    name: 'name',
                    description: 'description',
                    websiteUrl: 'http://site'
                })
                .expect(STATUS_CODE.BAD_REQUEST_400)
            expect(res2.body).toEqual(err('websiteUrl'))
        });
    })
})

//toMatchObject
// Частичное сравнение объектов
//toEqual
// Строгое сравнение: