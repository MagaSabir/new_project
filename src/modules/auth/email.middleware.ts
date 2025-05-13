import { body } from 'express-validator';
import {authRepository} from "./repositories/auth.repository";

export const emailValidationForRegistration = body('email')
    .isString()
    .trim()
    .isLength({ min: 1 })
    .isEmail()
    .withMessage('email is not correct')
    .custom(async (email: string) => {
        const user = await authRepository.findUser(email);
        if (user) {
            throw new Error('email already exist');
        }
        return true;
    });