import {body} from 'express-validator';
import {authRepository} from "./repositories/auth.repository";


export const loginValidationForRegistration = body('login')
    .isString()
    .trim()
    .isLength({ min: 3, max: 10 })
    .withMessage('login is not correct')
    .custom(async (login: string) => {
        const user = await authRepository.findUser(login)
        if (user) {
            throw new Error('login already exist');
        }
        return true;
    });