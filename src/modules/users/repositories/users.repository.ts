import {usersCollections} from "../../../db/mongoDb";
import {DeleteResult, ObjectId} from "mongodb";

export const usersRepository = {
    async createUser (body:any) {
        return await usersCollections.insertOne(body)
    },


    async deleteUser (id: string): Promise<boolean> {
        const result: DeleteResult = await usersCollections.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    },

    async findLoginOrEmail (email: string, login: string){
        return await usersCollections.findOne({$or: [{email}, {login}]})
    },

    async findUserByEmail (email: string){
        return await usersCollections.findOne({email})
    },

    async findUserByConfirmationCode (code: string) {
        return await usersCollections.findOne({confirmationCode: code})
    },

    async updateConfirmation (_id: ObjectId) {
        const result = await usersCollections.updateOne({_id}, {
            $set: { isConfirmed: true , createdAt: new Date().toISOString()},
        })
        return result.modifiedCount === 1
    },

    async updateResendConfirmation (email: string, code: string, expiration: string) {
        const result = await usersCollections.updateOne({email}, {
            $set: {confirmationCode: code, confirmationCodeExpiration: expiration}
        })
        return result.modifiedCount === 1
    },

    async updatePassword (_id: ObjectId, password: string) {
        console.log(password)
        const result = await usersCollections.updateOne({_id}, {
            $set: { isConfirmed: true , createdAt: new Date().toISOString(), password: password},
        })
        return result.modifiedCount === 1
    },

}
