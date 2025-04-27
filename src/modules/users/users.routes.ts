import {Router} from "express";
import {usersController} from "./controllers/users.controller";
import {authMiddleware} from "../../common/middlewares/authMiddleware";
import {
    emailValidation,
    loginValidation,
    passwordValidation
} from "../../common/middlewares/postValidation/users.validation";

export const userRouter = Router()


userRouter
.get('/', usersController.getUserController)
.post('/', authMiddleware, loginValidation, passwordValidation, emailValidation, usersController.postController)
.delete('/:id', authMiddleware, usersController.deleteUserController)