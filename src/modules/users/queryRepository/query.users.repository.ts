import {WithId} from "mongodb";
import {UserViewModel} from "../../../models/view_models/UserViewModel";
import {PaginationType} from "../../../common/types/types";
import {UserModel} from "../../../models/schemas/User.schema";
import {CreatedUserType} from "../../../models/schemas/Auth.schema";

export const queryUsersRepository = {
    async getUser(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, searchLoginTerm: any, searchEmailTerm: any): Promise<PaginationType<CreatedUserType>> {

        const filter2 = {
            $or: [{login: {$regex: searchLoginTerm, $options: 'i'}}, {
                email: {
                    $regex: searchEmailTerm,
                    $options: 'i'
                }
            }]
        }
        const newFilter = searchEmailTerm || searchLoginTerm ? filter2 : {}
        const totalCountUsers: number = await UserModel.countDocuments(newFilter)

        const users = await UserModel
            .find(newFilter)
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
    },

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
    },

    async getUseById(userId: string) {
        const user: WithId<CreatedUserType> | null = await UserModel.findById(userId)
        if (user)
            return {
                email: user.email,
                login: user.login,
                userId: userId
            }
        return null
    },
}
