import {Router} from "express";
import {
    emailValidation,
    loginOrEmail, newPasswordValidation,
    passwordValidation
} from "../../common/middlewares/postValidation/users.validation";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";
import {inputValidationErrors} from "../../common/adapters/errorMessage";
import {refreshMiddleware} from "../../common/middlewares/refresh.middleware";
import {rateLimitMiddleware} from "../../common/middlewares/rateLimit.middleware";
import {AuthController} from "./controllers/auth.controller";
import {container} from "../../composition-root";
const authController = container.get(AuthController)
export const authRoutes = Router()

authRoutes
    .post('/login', rateLimitMiddleware,loginOrEmail, passwordValidation, inputValidationErrors, authController.login.bind(authController))
    .get('/me', accessTokenMiddleware, inputValidationErrors, authController.getUser.bind(authController))
    .post('/registration', rateLimitMiddleware, passwordValidation, inputValidationErrors, authController.userRegistration.bind(authController))
    .post('/registration-confirmation', rateLimitMiddleware, authController.userConfirmation)
    .post('/registration-email-resending', rateLimitMiddleware, emailValidation, inputValidationErrors, authController.resendConfirm.bind(authController))
    .post('/refresh-token', refreshMiddleware, authController.refreshToken.bind(authController))
    .post('/logout', refreshMiddleware, authController.logOut.bind(authController))
    .post('/password-recovery', emailValidation, rateLimitMiddleware,inputValidationErrors, authController.passwordRecovery.bind(authController))
    .post('/new-password', rateLimitMiddleware, newPasswordValidation, inputValidationErrors, authController.newPassword.bind(authController))
