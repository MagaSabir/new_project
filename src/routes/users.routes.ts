import {Request, Response,Router} from "express";
import {usersController} from "../controllers/users.controller";
import {authMiddleware} from "../core/middlewares/authMiddleware";
import {emailValidation, loginValidation, passwordValidation} from "../validations/postValidation/users.validation";

export const userRouter = Router()


userRouter
.get('/', usersController.getUserController)
.post('/', authMiddleware, loginValidation, passwordValidation, emailValidation, usersController.postController)
.delete('/:id', authMiddleware, usersController.deleteUserController)