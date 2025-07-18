import {DeleteResult, ObjectId} from "mongodb";
// import {UserDocument, UserEntity, UserModel} from "../../../models/schemas/User.schema";
import {injectable} from "inversify";
import {UserDocument, UserModel} from "../domain/user.entity";

@injectable()
export class UsersRepository {

    async save(user: UserDocument) {
        const {_id} = await user.save()
        return _id.toString()
    }

    async deleteUser(id: string): Promise<boolean> {
        const result: DeleteResult = await UserModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
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
