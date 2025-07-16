import {injectable} from "inversify";

import {AuthModel} from "../../../models/schemas/Auth.schema";
import {UserModel} from "../../users/domain/user.entity";
import {PyloadTypeDb} from "../../../models/view_models/UserViewModel";

@injectable()
export class AuthRepository {
    async findUser(loginOrEmail: string) {
        return UserModel
            .findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}).lean()
    }

    async addSession(session: PyloadTypeDb) {
        await AuthModel.create(session)
    }

    async findSession(userId: string, deviceId: string) {
        return AuthModel.findOne({userId, deviceId}).lean()
    }

    async updateSession(userId: string, deviceId: string, iat: number | undefined, exp: number | undefined) {
        await AuthModel.updateOne(
            {userId, deviceId},
            {$set: {lastActiveDate: iat, expiration: exp}})
    }

    async deleteSessions(userId: string, deviceId: string) {
        await AuthModel.deleteOne({userId, deviceId})
    }
}


