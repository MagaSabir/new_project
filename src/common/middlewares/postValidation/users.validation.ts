import {body} from "express-validator";
import {usersRepository} from "../../../modules/users/repositories/users.repository";

export const loginValidation = body('login').isString().isLength({min:3, max: 10}).withMessage('LOGIN')
export const passwordValidation = body('password').isLength({min:6, max: 20}).withMessage('PASSWORD')
export const emailValidation = body('email').isEmail().withMessage('EMAIL')
export const loginOrEmail = body('loginOrEmail').isString().withMessage('LoginOREmail').trim().isLength({min: 3, max: 500})


export const newPasswordValidation = body('newPassword').isLength({min:6, max: 20}).withMessage('PASSWORD')
// export const recoveryCode = body('recoveryCode').custom(async (value) => {
//     const user = await usersRepository.findUserByConfirmationCode(value);
//
//     if (!user) {
//         throw new Error('Invalid recovery code');
//     }
//
//     if (user.confirmationCodeExpiration! < new Date()) {
//         throw new Error('Recovery code has expired');
//     }
//
//     return true;
// });
