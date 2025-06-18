import {DeleteResult, ObjectId} from "mongodb";
import {UserDocument, UserEntity, UserModel} from "../../../models/schemas/User.schema";
import {injectable} from "inversify";

@injectable()
export class UsersRepository {
    async createUser(userData: any) {
        const user = await UserModel.create(userData)
        return user._id.toString()
    }


    async deleteUser(id: string): Promise<boolean> {
        const result: DeleteResult = await UserModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    async findLoginOrEmail(email: string, login: string) {
        return UserModel.findOne({$or: [{email}, {login}]}).lean()
    }

    async findUserByEmail(email: string) {
        return UserModel.findOne({email}).lean();
    }

    async findUserByConfirmationCode(code: string) {
        return UserModel.findOne({confirmationCode: code}).lean();
    }

    async updateConfirmation(_id: ObjectId) {
        const result = await UserModel.updateOne({_id}, {
            $set: {isConfirmed: true, createdAt: new Date().toISOString()},
        })
        return result.modifiedCount === 1
    }

    async updateResendConfirmation(email: string, code: string, expiration: string) {
        const result = await UserModel.updateOne({email}, {
            $set: {confirmationCode: code, confirmationCodeExpiration: expiration}
        })
        return result.modifiedCount === 1
    }

    async updatePassword(_id: ObjectId, password: string) {
        const result = await UserModel.updateOne({_id}, {
            $set: {isConfirmed: true, createdAt: new Date().toISOString(), password: password},
        })
        return result.modifiedCount === 1
    }

}
