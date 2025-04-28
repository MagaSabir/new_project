import {client, db} from "../../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, WithId} from "mongodb";
import {userType} from "../../../common/types/userType/userType";

export const usersRepository = {
    async createUser (body:any):Promise<InsertOneResult<userType>> {
        return await client.db('blogPlatform').collection('users').insertOne(body)
    },
    // async getUser (pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, searchLoginTerm: any,searchEmailTerm: any) {
    //
    //     // const loginOrEmail = []
    //     //     if(searchLoginTerm || searchEmailTerm) {
    //     //         if(searchLoginTerm) {
    //     //             loginOrEmail.push({login: {$regex: searchLoginTerm, $options: 'i'}})
    //     //         }
    //     //         if(searchEmailTerm) {
    //     //             loginOrEmail.push({email: {$regex: searchEmailTerm, $options: 'i'}})
    //     //         }
    //     //     }
    //     //     const filter = loginOrEmail.length > 0 ? {$or: loginOrEmail} : {}
    //
    //         const filter2 = {$or: [{login: {$regex: searchLoginTerm, $options: 'i'}}, {email:{ $regex: searchEmailTerm, $options: 'i'}}]}
    //         const newFilter = searchEmailTerm || searchLoginTerm ? filter2: {}
    //     const totalCountUsers:number = await db.collection<userType>('users').countDocuments(newFilter)
    //
    //     const users: WithId<userType>[] = await db.collection<userType>('users')
    //         .find(newFilter)
    //         .skip((pageNumber - 1) * pageSize)
    //         .limit(pageSize)
    //         .sort({[sortBy]: sortDirection})
    //         .toArray()
    //     return {users, totalCountUsers}
    // },

    async deleteUser (id: string): Promise<boolean> {
        const result: DeleteResult = await client.db('blogPlatform').collection('users').deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async findLoginOrEmail (email: string, login: string): Promise<WithId<userType> | null> {
        return await db.collection<userType>('users').findOne({$or: [{email}, {login}]})
    }
}
