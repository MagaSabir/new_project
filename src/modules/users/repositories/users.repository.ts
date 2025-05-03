import {client, db} from "../../../db/mongoDb";
import {DeleteResult, InsertOneResult, ObjectId, WithId} from "mongodb";
import {userType} from "../../../common/types/userType/userType";

export const usersRepository = {
    async createUser (body:any):Promise<InsertOneResult<userType>> {
        return await client.db('blogPlatform').collection('users').insertOne(body)
    },


    async deleteUser (id: string): Promise<boolean> {
        const result: DeleteResult = await client.db('blogPlatform').collection('users').deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async findLoginOrEmail (email: string, login: string): Promise<WithId<userType> | null> {
        return await db.collection<userType>('users').findOne({$or: [{email}, {login}]})
    }
}
