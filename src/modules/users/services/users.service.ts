import {UsersRepository} from "../repositories/users.repository";
import bcrypt from 'bcrypt';
import {injectable} from "inversify";
import {UserModel} from "../domain/user.entity";
import {CreateUserDto} from "../domain/user.dto";
import {ObjectId} from "mongodb";

@injectable()
export class UserService {
    constructor(protected usersRepository: UsersRepository) {
    }

    async createUserService(dto: CreateUserDto) {
        const userEmail = await this.usersRepository.findLoginOrEmail(dto.email, dto.login)

        if (userEmail) return null

        const user = await UserModel.createUser(dto)
        const id: ObjectId = await this.usersRepository.save(user)
        return id.toString()
    }

    async deleteUserByID(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(id)
    }
}