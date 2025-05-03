import {client} from "../../../db/mongoDb";
import {ObjectId} from "mongodb";

export const commentRepository = {
    async deleteComment (id: string) {
        const result =  await client.db('blogPlatform').collection('comments').deleteOne({_id: new ObjectId(id)})
        return  result.deletedCount === 1
    }
}