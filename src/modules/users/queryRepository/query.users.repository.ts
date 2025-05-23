import { usersCollections} from "../../../db/mongoDb";
import {CreatedUserType} from "../../../common/types/userType/userType";
import {ObjectId, WithId} from "mongodb";
import {UserViewModel} from "../../../models/UserViewModel";
import {PaginationType} from "../../../common/types/types";

export const queryUsersRepository = {
    async getUser (pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, searchLoginTerm: any,searchEmailTerm: any): Promise<PaginationType<CreatedUserType>> {

        const filter2 = {$or: [{login: {$regex: searchLoginTerm, $options: 'i'}}, {email:{ $regex: searchEmailTerm, $options: 'i'}}]}
        const newFilter = searchEmailTerm || searchLoginTerm ? filter2: {}
        const totalCountUsers:number = await usersCollections.countDocuments(newFilter)

        const users: WithId<CreatedUserType>[] = await usersCollections
            .find(newFilter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        const newUser: UserViewModel[] = users.map((el:WithId<CreatedUserType>): UserViewModel => {
            return {
                id: el._id.toString(),
                login: el.login,
                email: el.email,
                createdAt: el.createdAt
            }
        })
        return {
            pagesCount: Math.ceil(totalCountUsers/ pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountUsers,
            items: newUser
        }
    },

    async getCreatedUser (userId: string): Promise<UserViewModel | null> {
        const user: WithId<CreatedUserType> | null =  await usersCollections.findOne({_id: new ObjectId(userId)})
        if(user)
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
        return null
    },

    async getUseById (userId: string) {
        const user: WithId<CreatedUserType> | null =  await usersCollections.findOne({_id: new ObjectId(userId)})
        if(user)
            return {
                email: user.email,
                login: user.login,
                userId: userId
            }
        return null
    },
}
