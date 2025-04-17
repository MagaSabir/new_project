import {usersRepository} from "../repositories/users.repository";

export const userService = {
    async createUserService  (body: any)  {
        const user = await usersRepository.createUser(body)
        return {
            id: user.insertedId,
            password: body.password,
            email: body.email
        }
    }
}