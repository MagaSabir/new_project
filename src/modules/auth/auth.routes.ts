import {Router} from "express";
import {authController} from "./controllers/auth.controller";
import {loginOrEmail, passwordValidation} from "../../common/middlewares/postValidation/users.validation";
import {authMiddleware} from "../../common/middlewares/authMiddleware";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";

export const authRoutes = Router()

authRoutes
.post('/login',loginOrEmail, passwordValidation, authController.getAuth)
.get('/me', accessTokenMiddleware, authController.getUser)
