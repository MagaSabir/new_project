import {client, db} from "../db/mongoDb";
import {ObjectId} from "mongodb";

export const usersRepository = {
    async createUser (body:any) {
        const result = await client.db('blogPlatform').collection('users').insertOne(body)
        return result
    },
    async getUser (pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, searchLoginTerm: any,searchEmailTerm: any) {
        const orConditions = [];
        if (searchLoginTerm) {
            orConditions.push({ login: { $regex: searchLoginTerm, $options: 'i' } });
        }
        if (searchEmailTerm) {
            orConditions.push({ email: { $regex: searchEmailTerm, $options: 'i' } });
        }
        const filter = orConditions.length > 0 ? { $or: orConditions } : {};
        const totalCountUsers = await db.collection('users').countDocuments(filter)


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

    async findLoginOrEmail (email: string, login: string) {
        return await db.collection('users').findOne({$or: [{email}, {login}]})
    }
}
