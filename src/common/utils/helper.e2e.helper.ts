import {SETTINGS} from "../../settings";
import request from "supertest";
import {app} from "../../app";

export const auth = `Basic ${Buffer.from(`${SETTINGS.ADMIN_AUTH}`)
    .toString('base64')}`

export const err = (field: string) => {
    return {
        errorsMessages: expect.arrayContaining([{
            field: field,
            message: expect.any(String)
        }])
    }
}

export const createBlog = async (overrides ={}) => {
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

export const createPost = async (overrides: Object = {}) => {
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