import {Router} from "express";
import {authController} from "./controllers/auth.controller";
import {loginOrEmail, passwordValidation} from "../../common/middlewares/postValidation/users.validation";

export const authRoutes = Router()

authRoutes
.post('/login',loginOrEmail, passwordValidation, authController.getAuth)
.get('/me', authController.getUser)