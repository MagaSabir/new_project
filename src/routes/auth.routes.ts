import {Router} from "express";
import {authController} from "../controllers/auth.controller";
import {loginOrEmail, passwordValidation} from "../validations/postValidation/users.validation";

export const authRoutes = Router()

authRoutes
.post('/',loginOrEmail, passwordValidation, authController.getAuth)