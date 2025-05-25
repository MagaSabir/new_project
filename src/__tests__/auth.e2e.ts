import { nodemailerService } from "../common/adapters/nodemailer.service";
import { authService } from "../modules/auth/services/auth.service";

jest.mock('../common/adapters/nodemailer.service', () => ({
    nodemailerService: {
        sendEmail: jest.fn()
    }
}));

describe('test', () => {
    it('should ', async () => {
        (nodemailerService.sendEmail as jest.Mock).mockResolvedValue(true)

        const result = await authService.createUserService('user11','1234','test@mail.com')
        expect(result).toBe('успешно')
    });
})