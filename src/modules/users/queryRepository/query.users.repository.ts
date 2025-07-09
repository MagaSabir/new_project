import {WithId} from "mongodb";
import {UserViewModel} from "../../../models/view_models/UserViewModel";
import {PaginationType} from "../../../common/types/types";
// import {UserModel} from "../../../models/schemas/User.schema";
import {CreatedUserType} from "../../../models/schemas/Auth.schema";
import {injectable} from "inversify";
import {UserModel} from "../domain/user.entity";

@injectable()
export class QueryUsersRepository {
    async getUser(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, searchLoginTerm: any, searchEmailTerm: any): Promise<PaginationType<CreatedUserType>> {
        const loginOrEmail = []
        if (searchLoginTerm || searchEmailTerm) {
            if (searchLoginTerm) {
                loginOrEmail.push({login: {$regex: searchLoginTerm, $options: 'i'}})
            }
            if (searchEmailTerm) {
                loginOrEmail.push({email: {$regex: searchEmailTerm, $options: 'i'}})
            }
        }
        const filter = loginOrEmail.length > 0 ? {$or: loginOrEmail} : {}
        const totalCountUsers: number = await UserModel.countDocuments(filter)

        const users = await UserModel
            .find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()

        const newUser: UserViewModel[] = users.map((el: WithId<CreatedUserType>): UserViewModel => {
            return {
                id: el._id.toString(),
                login: el.login,
                email: el.email,
                createdAt: el.createdAt
            }
        })
        return {
            pagesCount: Math.ceil(totalCountUsers / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountUsers,
            items: newUser
        }
    }

    async getCreatedUser(userId: string): Promise<UserViewModel | null> {
        const user: WithId<CreatedUserType> | null = await UserModel.findById(userId)
        if (user)
            return {
                id: user._id.toString(),
                login: user.login,
                email: user.email,
                createdAt: user.createdAt
            }
        return null
    }

    async getUseById(userId: string) {
        const user: WithId<CreatedUserType> | null = await UserModel.findById(userId)
        if (user)
            return {
                email: user.email,
                login: user.login,
                userId: userId
            }
        return null
    }
}
