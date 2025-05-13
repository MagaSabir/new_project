import {Router} from "express";
import {usersController} from "./controllers/users.controller";
import {basicAuthMiddleware} from "../../common/middlewares/basic.auth.middleware";
import {
    emailValidation,
    loginValidation,
    passwordValidation
} from "../../common/middlewares/postValidation/users.validation";
import {inputValidationErrors} from "../../common/adapters/errorMessage";

export const userRouter = Router()


userRouter
.get('/', usersController.getUserController)
.post('/', basicAuthMiddleware, loginValidation, passwordValidation, emailValidation, inputValidationErrors, usersController.postController)
.delete('/:id', basicAuthMiddleware, usersController.deleteUserController)