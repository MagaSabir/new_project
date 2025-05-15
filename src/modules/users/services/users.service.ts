import {usersRepository} from "../repositories/users.repository";
import bcrypt from 'bcrypt';
import {InsertOneResult, WithId} from "mongodb";
import {CreatedUserType} from "../../../common/types/userType/userType";

export const userService = {
    async createUserService  (body: any) {
        const {email, login} = body
        const userEmail: WithId<CreatedUserType> | null = await usersRepository.findLoginOrEmail(email, login)
        if(userEmail) {
            return null
        }
        const hash = await bcrypt.hash(body.password, 10)
        const user = {
            login: body.login,
            password: hash,
            email: body.email,
            createdAt: new Date().toISOString()
        }
        const newUser: InsertOneResult<CreatedUserType> = await usersRepository.createUser(user)
        return newUser.insertedId.toString()

    },

    async deleteUserByID (id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    }
}