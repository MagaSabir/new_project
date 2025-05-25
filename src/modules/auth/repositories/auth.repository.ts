import {client} from "../../../db/mongoDb";
import {ObjectId} from "mongodb";

export const authRepository = {
    async findUser(body: any) {
        return  await client.db('blogPlatform').collection('users')
            .findOne({$or: [{login: body}, {email: body}]})
    },

    async blackList(tokenId: string) {
        const result =   await client.db('blogPlatform').collection('blacklist')
            .insertOne({tokenId})
        return result.insertedId
    },

    async findTokenInBlacklist(tokenId: string) {
        const result =  await client.db('blogPlatform').collection('blacklist').findOne({tokenId})
        return result ? true : false
    }
}

