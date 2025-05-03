import {client} from "../../../db/mongoDb";

export const commentRepository = {
    async createPost (content: any) {
        return await client.db('blogPlatform').collection('comments').insertOne(content)
    }
}