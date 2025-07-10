import {Router} from "express";
import {basicAuthMiddleware} from "../../../common/middlewares/basic.auth.middleware";
import {
    emailValidation,
    loginValidation,
    passwordValidation
} from "../../../common/middlewares/postValidation/users.validation";
import {inputValidationErrors} from "../../../common/adapters/errorMessage";
import {container} from "../../../composition-root";
import {UsersController} from "./users.controller";

export const usersController = container.get(UsersController)
export const userRouter = Router()


userRouter
.get('/', usersController.getUserController.bind(usersController))
.post('/', basicAuthMiddleware, loginValidation, passwordValidation, emailValidation, inputValidationErrors, usersController.createUserController.bind(usersController))
.delete('/:id', basicAuthMiddleware, usersController.deleteUserController.bind(usersController))