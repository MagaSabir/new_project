import {client} from "../../../db/mongoDb";
import {ObjectId} from "mongodb";

export const queryRepoComment = {
    async getComment (id: string) {
        const comment = await client.db('blogPlatform').collection('comments').findOne({_id: new ObjectId(id)})
        return {

        }
    }
}