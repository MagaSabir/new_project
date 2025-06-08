import {Router} from "express";
import {authController} from "./controllers/auth.controller";
import {
    emailValidation,
    loginOrEmail,
    passwordValidation
} from "../../common/middlewares/postValidation/users.validation";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";
import {inputValidationErrors} from "../../common/adapters/errorMessage";
import {refreshMiddleware} from "../../common/middlewares/refresh.middleware";
import {rateLimitMiddleware} from "../../common/middlewares/rateLimit.middleware";

export const authRoutes = Router()

authRoutes
    .post('/login', rateLimitMiddleware,loginOrEmail, passwordValidation, inputValidationErrors, authController.login)
    .get('/me', accessTokenMiddleware, inputValidationErrors, authController.getUser)
    .post('/registration', rateLimitMiddleware, passwordValidation, inputValidationErrors, authController.userRegistration)
    .post('/registration-confirmation', rateLimitMiddleware, authController.userConfirmation)
    .post('/registration-email-resending', rateLimitMiddleware, emailValidation, inputValidationErrors, authController.resendConfirm)
    .post('/refresh-token', refreshMiddleware, authController.refreshToken)
    .post('/logout', refreshMiddleware, authController.logOut)
    .post('/password-recovery', authController.recovery)
    .post('/new-password', authController.newLogin)
