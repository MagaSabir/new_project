import {UsersRepository} from "../infrasctructure/users.repository";
import {injectable} from "inversify";
import {UserModel} from "../domain/user.entity";
import {CreateUserDto} from "../domain/user.dto";
import {QueryUsersRepository} from "../infrasctructure/query.users.repository";

@injectable()
export class UserService {
    constructor(
        protected usersRepository: UsersRepository,
        protected queryRepository: QueryUsersRepository) {
    }

    async createUserService(dto: CreateUserDto) {
        const userEmail = await this.queryRepository.findLoginOrEmail(dto.email, dto.login)
        if (userEmail) return null
        const user = await UserModel.createUser(dto)
        return  await this.usersRepository.save(user)
    }

    async deleteUserByID(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(id)
    }
}