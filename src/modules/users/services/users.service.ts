import {usersRepository} from "../repositories/users.repository";
import bcrypt from 'bcrypt';
import {InsertOneResult, WithId} from "mongodb";
import {CreatedUserType} from "../../../common/types/userType/userType";

export const userService = {
    async createUserService  (bodyReq: any) {
        const userEmail: WithId<CreatedUserType> | null = await usersRepository.findLoginOrEmail(bodyReq.email, bodyReq.login)
        if(userEmail) {
            return null
        }
        const hash = await bcrypt.hash(bodyReq.password, 10)
        const user = {
            login: bodyReq.login,
            password: hash,
            email: bodyReq.email,
            createdAt: new Date().toISOString()
        }
        const newUser: InsertOneResult<CreatedUserType> = await usersRepository.createUser(user)
        return newUser.insertedId.toString()

    },

    async deleteUserByID (id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    }
}