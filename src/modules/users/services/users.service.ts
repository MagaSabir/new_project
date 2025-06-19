import {UsersRepository} from "../repositories/users.repository";
import bcrypt from 'bcrypt';
import {injectable} from "inversify";
import {CreateUserDto} from "../controllers/users.controller";

@injectable()
export class UserService {
    constructor(protected usersRepository: UsersRepository) {
    }

    async createUserService(dto: CreateUserDto) {
        const {login, email, password} = dto
        const userEmail = await this.usersRepository.findLoginOrEmail(email, login)
        if (userEmail) {
            return null
        }
        const passwordHash = await bcrypt.hash(password, 10)
        const user = {
            login,
            email,
            passwordHash,
            createdAt: new Date().toISOString()
        }
        const id = await this.usersRepository.createUser(user)
        return id.toString()
    }

    async deleteUserByID(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(id)
    }
}