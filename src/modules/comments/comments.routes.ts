import {Router} from "express";
import {commentController} from "./controllers/comment.controller";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";
import {contentValidation} from "../../common/middlewares/commentValidation/comment.validation";
import {inputValidationErrors} from "../../common/adapters/errorMessage";

export const commentsRoutes = Router()

commentsRoutes
    .get('/:id', commentController.getComment)
    .delete('/:id', accessTokenMiddleware, commentController.deleteCommentByID)
    .put('/:id',contentValidation, accessTokenMiddleware, inputValidationErrors, commentController.updateComment)