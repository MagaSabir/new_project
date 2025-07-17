import { describe } from '@jest/globals';
import {UserModel} from "../../modules/users/domain/user.entity";

describe('user entity test', () => {
    const dto = {
        login: 'test',
        email: 'test@mail.ru',
        password: '123456789'
    }

    it('should create new user', async () => {
        const user = await UserModel.createUser(dto)
        expect(user.login).toBe(dto.login)
        expect(user.email).toBe(dto.email)
        expect(user._id).toBeDefined()
        expect(user.password).toBeDefined()
    });

    it('should register new user', async  () => {
        const user = await UserModel.registerUser(dto)

        expect(user.isConfirmed).toBe(false)

    })
})