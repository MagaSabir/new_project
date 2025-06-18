import {usersRepository} from "../repositories/users.repository";
import bcrypt from 'bcrypt';

export const userService = {
    async createUserService(body: any) {
        const {email, login} = body
        const userEmail = await usersRepository.findLoginOrEmail(email, login)
        if (userEmail) {
            return null
        }
        const hash = await bcrypt.hash(body.password, 10)
        const user = {
            login: body.login,
            password: hash,
            email: body.email,
            createdAt: new Date().toISOString()
        }
        const id = await usersRepository.createUser(user)
        return id.toString()
    },

    async deleteUserByID(id: string): Promise<boolean> {
        return await usersRepository.deleteUser(id)
    }
}