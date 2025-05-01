import {usersRepository} from "../repositories/users.repository";
import bcrypt from 'bcrypt';
import {ObjectId, WithId} from "mongodb";
import {userType} from "../../../common/types/userType/userType";

export const userService = {
    async createUserService  (bodyReq: any): Promise<ObjectId | boolean>  {
        const userEmail: WithId<userType> | null = await usersRepository.findLoginOrEmail(bodyReq.email, bodyReq.login)
        if(userEmail) {
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
        return newUser.insertedId

    },

    async deleteUserByID (id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    }
}