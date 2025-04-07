import {Router} from "express";
import {blogController} from "../controllers/blog.controller";
import {descriptionValidator, nameValidator, websiteUrlValidator} from "../validations/blogValidation/blog.validation";
import {authMiddleware} from "../core/middlewares/authMiddleware";

export const blogRouter = Router()


blogRouter
    .get('/:id', blogController.getBlogById)
    .get('/',  blogController.getAllBlogs)
    .post('/', authMiddleware, nameValidator, descriptionValidator, websiteUrlValidator, blogController.postController)
    .put('/:id', authMiddleware, nameValidator, descriptionValidator, websiteUrlValidator, blogController.putController)
    .delete('/:id', authMiddleware, blogController.deleteController)