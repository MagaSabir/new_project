import {db} from "../../../db/mongoDb";
import {userType} from "../../../common/types/userType/userType";
import {ObjectId, WithId} from "mongodb";
import {UserViewModel} from "../../../models/UserViewModel";

export const queryUsersRepository = {
    async getUser (pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, searchLoginTerm: any,searchEmailTerm: any) {

        const filter2 = {$or: [{login: {$regex: searchLoginTerm, $options: 'i'}}, {email:{ $regex: searchEmailTerm, $options: 'i'}}]}
        const newFilter = searchEmailTerm || searchLoginTerm ? filter2: {}
        const totalCountUsers:number = await db.collection<userType>('users').countDocuments(newFilter)

        const users: WithId<userType>[] = await db.collection<userType>('users')
            .find(newFilter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        const newUser: UserViewModel[] = users.map((el:WithId<userType>): UserViewModel => {
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

    async getCreatedUser (userId: ObjectId): Promise<UserViewModel | null> {
        const user =  await db.collection('users').findOne({_id: new ObjectId(userId)})
        if(user)
        return {
            id: user._id.toString(),
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
        return null
    }

}