import {Router} from "express";
import {authController} from "./controllers/auth.controller";
import {loginOrEmail, passwordValidation} from "../../common/middlewares/postValidation/users.validation";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";
import {inputValidationErrors} from "../../common/utils/errorMessage";

export const authRoutes = Router()

authRoutes
.post('/login',loginOrEmail, passwordValidation, authController.getAuth)
.get('/me', accessTokenMiddleware, inputValidationErrors, authController.getUser)
