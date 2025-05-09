import {Router} from "express";
import {blogController} from "./controllers/blog.controller";
import {
  descriptionValidator,
  nameValidator,
  websiteUrlValidator,
} from "../../common/middlewares/blogValidation/blogs.validations";
import {basicAuthMiddleware} from "../../common/middlewares/basic.auth.middleware";
import {
  contentValidator,
  shortDescriptionValidator,
  titleValidation
} from "../../common/middlewares/blogValidation/posts.validations";
import {IDisValid} from "../../common/middlewares/IDisValidMiddleware";
import { inputValidationErrors} from "../../common/utils/errorMessage";

export const blogRouter = Router();

blogRouter
  .get("/:id", IDisValid, blogController.getBlog)
  .get("/", blogController.getAllBlogs)
  .post(
    "/",
    basicAuthMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,inputValidationErrors,
    blogController.createBlog,
  )
  .post("/:id/posts",   IDisValid, basicAuthMiddleware, titleValidation,
      shortDescriptionValidator,
      contentValidator,inputValidationErrors, blogController.createPostByBlogId)
  .get("/:id/posts", IDisValid,inputValidationErrors, blogController.getPostsByBlogID)
  .put(
    "/:id",
      IDisValid,
    basicAuthMiddleware,
    nameValidator,
    descriptionValidator,
    websiteUrlValidator,
      inputValidationErrors,
    blogController.updateBlog,
  )
  .delete("/:id", IDisValid, basicAuthMiddleware, inputValidationErrors, blogController.deleteBlog);
