import {Router} from "express";
import {authController} from "./controllers/auth.controller";
import {
    emailValidation,
    loginOrEmail,
    passwordValidation
} from "../../common/middlewares/postValidation/users.validation";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";
import {inputValidationErrors} from "../../common/adapters/errorMessage";

export const authRoutes = Router()

authRoutes
    .post('/login', loginOrEmail, passwordValidation, inputValidationErrors, authController.login)
    .get('/me', accessTokenMiddleware, inputValidationErrors, authController.getUser)
    .post('/registration', passwordValidation, inputValidationErrors, authController.userRegistration)
    .post('/registration-confirmation', authController.userConfirmation)
    .post('/registration-email-resending', emailValidation, inputValidationErrors, authController.resendConfirm)
    .post('/refresh-token', authController.refreshToken)
    .post('/logout', authController.logOut)

