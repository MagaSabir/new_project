import {Router} from "express";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";
import {contentValidation} from "../../common/middlewares/commentValidation/comment.validation";
import {inputValidationErrors} from "../../common/adapters/errorMessage";
import {CommentController} from "./controllers/comment.controller";
import {container} from "../../composition-root";
import {checkAccess} from "../../common/middlewares/authAccess";

const commentController = container.get(CommentController)
export const commentsRoutes = Router()

commentsRoutes
    .get('/:id',checkAccess, commentController.getComment.bind(commentController))
    .delete('/:id', accessTokenMiddleware, commentController.deleteCommentByID.bind(commentController))
    .put('/:id',contentValidation, accessTokenMiddleware, inputValidationErrors, commentController.updateComment.bind(commentController))
    .put('/:id/like-status', accessTokenMiddleware, commentController.setLike.bind(commentController))