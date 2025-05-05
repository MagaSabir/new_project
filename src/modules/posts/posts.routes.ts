import { Router } from "express";
import { postsController } from "./controllers/posts.controller";
import {
  blogIdValidator,
  contentValidator,
  shortDescriptionValidator,
  titleValidation,
} from "../../common/middlewares/blogValidation/posts.validations";
import { basicAuthMiddleware } from "../../common/middlewares/basic.auth.middleware";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";
import {inputValidationErrors} from "../../common/utils/errorMessage";
import {contentValidation} from "../../common/middlewares/commentValidation/comment.validation";

export const postRouter = Router();

postRouter
  .get("/", postsController.getPosts)
  .get("/:id", postsController.getPostById)
  .put(
    "/:id",
    basicAuthMiddleware,
    titleValidation,
    shortDescriptionValidator,
    contentValidator,
      inputValidationErrors,
    postsController.updatePost,
  )
  .delete("/:id", basicAuthMiddleware, postsController.deletePost)
  .post(
    "/",
    basicAuthMiddleware,
    blogIdValidator,
    titleValidation,
    shortDescriptionValidator,
    contentValidator,
      inputValidationErrors,
    postsController.createPost,
  )
  .post('/:id/comments',contentValidation, accessTokenMiddleware,inputValidationErrors, postsController.createCommentByPostId)
  .get('/:id/comments', postsController.getComments)
