import {client} from "../db/mongoDb";

export const usersRepository = {
    async createUser (body:any) {
        const result = await client.db('blogPlatform').collection('users').insertOne(body)
        return result
    },
    async getUser () {
        return await client.db('blogPlatform').collection('users').find().toArray()
    }
}
