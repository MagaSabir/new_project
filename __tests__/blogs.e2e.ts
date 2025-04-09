import request from 'supertest';
import {app} from "../src/app";
import {SETTINGS} from "../src/settings";


describe('/blogs', () => {


    const auth = `Basic ${Buffer.from(`${SETTINGS.ADMIN_AUTH}`)
        .toString('base64')}`

    beforeAll(async () => {
        await request(app).delete(SETTINGS.PATH.cleanDB)
    })

    let createdBlogId: string;

    it('должен создать блог', async () => {
        const response = await request(app)
            .post('/blogs')
            .set('Authorization', auth)
            .send({
                name: 'Test blog',
                description: 'Описание',
                websiteUrl: 'https://example.com',
            })
            .expect(201);

        expect(response.body).toHaveProperty('id');
        createdBlogId = response.body.id;
    });

    it('должен получить блог по id', async () => {
        const response = await request(app)
            .get(`/blogs/${createdBlogId}`)
            .expect(200);

        expect(response.body.name).toBe('Test blog');
    });

    it('должен обновить блог', async () => {
        await request(app)
            .put(`/blogs/${createdBlogId}`)
            .set('Authorization', auth)
            .send({
                name: 'Обновлённый блог',
                description: 'Новое описание',
                websiteUrl: 'https://updated.com',
            })
            .expect(400);
    });

    it('должен удалить блог', async () => {
        await request(app)
            .delete(`/blogs/${createdBlogId}`)
            .set('Authorization', auth)
            .expect(204);
    });

    it('не должен найти удалённый блог', async () => {
        await request(app)
            .get(`/blogs/${createdBlogId}`)
            .expect(404);
    });

})