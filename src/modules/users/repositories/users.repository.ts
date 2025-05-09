import {client, db} from "../../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, WithId} from "mongodb";
import {UserType} from "../../../common/types/userType/userType";

export const usersRepository = {
    async createUser (body:any):Promise<InsertOneResult<UserType>> {
        return await client.db('blogPlatform').collection('users').insertOne(body)
    },


    async deleteUser (id: string): Promise<boolean> {
        const result: DeleteResult = await client.db('blogPlatform').collection('users').deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async findLoginOrEmail (email: string, login: string): Promise<WithId<UserType> | null> {
        return await db.collection<UserType>('users').findOne({$or: [{email}, {login}]})
    }
}
