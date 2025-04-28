import {body} from "express-validator";

export const loginValidation = body('login').isString().isLength({min:3, max: 10}).withMessage('LOGIN')
export const passwordValidation = body('password').isLength({min:6, max: 20}).withMessage('PASSWORD')
export const emailValidation = body('email').isEmail().withMessage('EMAIL')
export const loginOrEmail = body('loginOrEmail').isString().withMessage('LoginOREmail').trim().isLength({min: 3, max: 500})

