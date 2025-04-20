import {usersRepository} from "../repositories/users.repository";
import bcrypt from 'bcrypt';

export const userService = {
    async createUserService  (bodyReq: any)  {
        const userEmail = await usersRepository.findLoginOrEmail(bodyReq.email, bodyReq.login)
        if(userEmail) {
            console.log("11")
            return false
        }
        const hash = await bcrypt.hash(bodyReq.password, 10)
        const user = {
            login: bodyReq.login,
            password: hash,
            email: bodyReq.email,
            createdAt: new Date().toISOString()
        }
        const newUser = await usersRepository.createUser(user)
        return {
            id: newUser.insertedId,
            login: user.login,
            email: user.email,
            createdAt: user.createdAt
        }
    },

    async getUsers (pageNumber:number, pageSize:number, sortDirection: any, sortBy: any, searchLoginTerm: any, searchEmailTerm: any): Promise<any> {
        const { users, totalCountUsers } = await usersRepository.getUser(
            pageNumber,
            pageSize,
            sortDirection,
            sortBy,
            searchLoginTerm,
            searchEmailTerm

        )

        const newUser = users.map(el => {
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

    async deleteUserByID (id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    }
}