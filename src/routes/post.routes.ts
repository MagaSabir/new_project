import { Router } from "express";
import { postController } from "../controllers/post.controller";
import {
  blogIdValidator,
  contentValidator,
  shortDescriptionValidator,
  titleValidation,
} from "../validations/blogValidation/postValidation";
import { authMiddleware } from "../core/middlewares/authMiddleware";

export const postRouter = Router();

postRouter
  .get("/", postController.getAllPosts)
  .get("/:id", postController.getPostById)
  .put(
    "/:id",
    authMiddleware,
    titleValidation,
    shortDescriptionValidator,
    contentValidator,
    postController.putController,
  )
  .delete("/:id", authMiddleware, postController.deleteController)
  .post(
    "/",
    authMiddleware,
    blogIdValidator,
    titleValidation,
    shortDescriptionValidator,
    contentValidator,
    postController.postController,
  );
