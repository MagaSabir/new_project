import {Request, Response,Router} from "express";
import {usersController} from "../controllers/users.controller";
import {authMiddleware} from "../core/middlewares/authMiddleware";

export const userRouter = Router()

userRouter
.get('/', usersController.getUserController)
.post('/', authMiddleware, usersController.postController)
.delete('/:id', authMiddleware, usersController.deleteUserController)