import {usersRepository} from "../repositories/users.repository";
import bcrypt from 'bcrypt';

export const userService = {
    async createUserService  (body: any)  {
        const hash = await bcrypt.hash(body.password, 10)
        const user = {
            login: body.login,
            password: hash,
            email: body.email,
            createdAt: new Date().toISOString()
        }
        const newUser = await usersRepository.createUser(user)
        return {
            id: newUser.insertedId,
            login: body.login,
            email: body.email,
            createdAt: new Date().toISOString()
        }
    },

    async getUsers (): Promise<any> {
        const users = await usersRepository.getUser()
        return users.map((el:any) => {
            return {
                id: el._id.toString(),
                login: el.login,
                email: el.email,
                createdAt: new Date().toISOString()
        }
        })


}
}