import {Router} from "express";
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
import {inputValidationErrors} from "../../common/adapters/errorMessage";
import {blogsController} from "../../composition-root";

export const blogRouter = Router();

blogRouter
    .get("/:id", blogsController.getBlog.bind(blogsController))
    .get("/", blogsController.getBlogs.bind(blogsController))
    .post("/", basicAuthMiddleware, nameValidator, descriptionValidator, websiteUrlValidator, inputValidationErrors,
        blogsController.createBlog.bind(blogsController))
    .post("/:id/posts", IDisValid, basicAuthMiddleware, titleValidation,
        shortDescriptionValidator, contentValidator, inputValidationErrors,
        blogsController.createPostByBlogId.bind(blogsController))
    .get("/:id/posts", IDisValid, inputValidationErrors, blogsController.getPostsByBlogId.bind(blogsController))
    .put("/:id", IDisValid, basicAuthMiddleware, nameValidator,
        descriptionValidator, websiteUrlValidator, inputValidationErrors,
        blogsController.updateBlog.bind(blogsController))
    .delete("/:id", IDisValid, basicAuthMiddleware, inputValidationErrors, blogsController.deleteBlog.bind(blogsController));
