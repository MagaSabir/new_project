import {client} from "../../../db/mongoDb";
import {ObjectId} from "mongodb";

export const queryRepoComment = {
    async getCommentById(id: string) {
        const comment = await client.db('blogPlatform').collection('comments').findOne({_id: new ObjectId(id)})
        if(!comment) return null
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt

        }
    },

    async getComments(id: string) {
        const comments = await client.db('blogPlatform').collection('comments').find()
    }
}