import {client, db} from "../db/mongoDb";
import {ObjectId} from "mongodb";
import {log} from "node:util";

export const usersRepository = {
    async createUser (body:any) {
        const result = await client.db('blogPlatform').collection('users').insertOne(body)
        return result
    },
    async getUser (pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, searchNameTerm: any) {
        const totalCountUsers = await db.collection('users').countDocuments()
        const filter = searchNameTerm ? {$or : [{login: {$regex:searchNameTerm, $options: 'i'}}, {email: {$regex: searchNameTerm, $options: 'i'}}]} : {}

        const users = await db.collection('users')
            .find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()
        return {users, totalCountUsers}
    },


    async deleteUser (id: string) {
        const result = await client.db('blogPlatform').collection('users').deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async fundOne (email: string) {
        return await db.collection('users').findOne({email})
    }
}
