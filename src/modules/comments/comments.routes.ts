import {Router} from "express";
import {commentController} from "./controllers/comment.controller";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";

export const commentsRoutes = Router()

commentsRoutes
.get('/:id', commentController.getComment)
.delete('/:id', accessTokenMiddleware, commentController.deleteCommentByID)