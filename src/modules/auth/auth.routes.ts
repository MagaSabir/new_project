import {Router} from "express";
import {authController} from "./controllers/auth.controller";
import {
    emailValidation,
    loginOrEmail,
    loginValidation,
    passwordValidation
} from "../../common/middlewares/postValidation/users.validation";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";
import {inputValidationErrors} from "../../common/adapters/errorMessage";
import {loginValidationForRegistration} from "./login.middleware";
import {emailValidationForRegistration} from "./email.middleware";

export const authRoutes = Router()

authRoutes
.post('/login',loginOrEmail, passwordValidation, inputValidationErrors, authController.getAuth)
.get('/me', accessTokenMiddleware, inputValidationErrors, authController.getUser)
    .post('/registration', loginValidationForRegistration, emailValidationForRegistration, passwordValidation, inputValidationErrors, authController.userRegistration)
    .post('/registration-confirmation', authController.userConfirmation)
    .post('/registration-email-resending', emailValidation, inputValidationErrors, authController.resendConfirm)

