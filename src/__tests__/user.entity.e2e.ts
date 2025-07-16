import {describe} from "node:test";
import {UserModel} from "../modules/users/domain/user.entity";

describe('user entity test', () => {
    it('should create new user', async () => {

        const dto = {
            login: 'test',
            email: 'test@mail.ru',
            password: '123456789'
        }
        const user = await UserModel.createUser(dto)

        expect(user.login).toBe(dto.login)
        expect(user.email).toBe(dto.email)
        expect(user._id).toBeDefined()
        expect(user.password).toBeDefined()
    });
})