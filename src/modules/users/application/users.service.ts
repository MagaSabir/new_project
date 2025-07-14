import {UsersRepository} from "../infrasctructure/users.repository";
import {injectable} from "inversify";
import {UserDocument, UserModel, UserType} from "../domain/user.entity";
import {CreateUserDto} from "../domain/user.dto";
import {QueryUsersRepository} from "../infrasctructure/query.users.repository";

@injectable()
export class UserService {
    constructor(
        protected usersRepository: UsersRepository,
        protected queryRepository: QueryUsersRepository) {
    }

    async createUserService(dto: CreateUserDto): Promise<string | null> {
        const user: UserType | null = await this.queryRepository.findLoginOrEmail(dto.email, dto.login)
        if (user) return null
        const newUser: UserDocument = await UserModel.createUser(dto)
        return  await this.usersRepository.save(newUser)
    }

    async deleteUserByID(id: string): Promise<boolean> {
        return await this.usersRepository.deleteUser(id)
    }
}