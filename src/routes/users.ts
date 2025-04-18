import {Router} from "express";
import {usersController} from "../controllers/users.controller";

export const userRouter = Router()
    userRouter
        .post('/', usersController.postController)
        .get('/',usersController.getUser)