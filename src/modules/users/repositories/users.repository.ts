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

    async findLoginOrEmail (email: string, login: string){
        return await db.collection('users').findOne({$or: [{email}, {login}]})
    },

    async findUserByEmail (email: string){
        return await db.collection('users').findOne({email})
    },

    async findUserByConfirmationCode (code: string) {
        return await db.collection('users').findOne({confirmationCode: code})
    },

    async updateConfirmation (_id: ObjectId) {
        const result = await db.collection('users').updateOne({_id}, {
            $set: { isConfirmed: true , createdAt: new Date().toISOString()},
            $unset: { confirmationCode: "", confirmationCodeExpiration: "" },
        })
        return result.modifiedCount === 1
    },

    async updateResendConfirmation (email: string, code: string, expiration: string) {
        const result = await db.collection('users').updateOne({email}, {
            $set: {confirmationCode: code, confirmationCodeExpiration: expiration}
        })
        return result.modifiedCount === 1
    }

}
