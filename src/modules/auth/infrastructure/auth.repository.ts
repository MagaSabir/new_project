import {injectable} from "inversify";

import {UserModel} from "../../users/domain/user.entity";
import {AuthModel, SessionType} from "../domain/session.entity";

@injectable()
export class AuthRepository {
    async findUser(loginOrEmail: string) {
        return UserModel
            .findOne({$or: [{login: loginOrEmail}, {email: loginOrEmail}]}).lean()
    }

    async addSession(session: SessionType) {
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


