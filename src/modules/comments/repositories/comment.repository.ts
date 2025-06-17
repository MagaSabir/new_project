import {client} from "../../../db/mongoDb";
import {ObjectId} from "mongodb";

export const commentRepository = {
    async createPost (content: any) {
        return await client.db('blogPlatform').collection('comments').insertOne(content)
    },

    async deleteComment (id: string) {
        const result =  await client.db('blogPlatform').collection('comments').deleteOne({_id: new ObjectId(id)})
        return  result.deletedCount === 1
    },

    async updateComment (id: string, data: any) {
        const result = await client.db('blogPlatform').collection('comments')
            .updateOne({_id: new ObjectId(id)}, {$set: data})
        return result.matchedCount === 1
    },

    async addLike (id: string, status: string) {
        const result = await client.db('blogPlatform').collection('')
    }
}