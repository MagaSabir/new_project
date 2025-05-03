import { Router } from "express";
import { postsController } from "./controllers/posts.controller";
import {
  blogIdValidator,
  contentValidator,
  shortDescriptionValidator,
  titleValidation,
} from "../../common/middlewares/blogValidation/posts.validations";
import { authMiddleware } from "../../common/middlewares/authMiddleware";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";

export const postRouter = Router();

postRouter
  .get("/", postsController.getPosts)
  .get("/:id", postsController.getPostById)
  .put(
    "/:id",
    authMiddleware,
    titleValidation,
    shortDescriptionValidator,
    contentValidator,
    postsController.updatePost,
  )
  .delete("/:id", authMiddleware, postsController.deletePost)
  .post(
    "/",
    authMiddleware,
    blogIdValidator,
    titleValidation,
    shortDescriptionValidator,
    contentValidator,
    postsController.createPost,
  )
  .post('/:id/comments', accessTokenMiddleware, postsController.createCommentByPostId)
