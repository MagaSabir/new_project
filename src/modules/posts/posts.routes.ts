import {Router} from "express";
import {
    blogIdValidator,
    contentValidator,
    shortDescriptionValidator,
    titleValidation,
} from "../../common/middlewares/blogValidation/posts.validations";
import {basicAuthMiddleware} from "../../common/middlewares/basic.auth.middleware";
import {accessTokenMiddleware} from "../../common/middlewares/auth.middleware";
import {inputValidationErrors} from "../../common/adapters/errorMessage";
import {contentValidation} from "../../common/middlewares/commentValidation/comment.validation";
import {PostsController} from "./controllers/posts.controller";
import {container} from "../../composition-root";
import {checkAccess} from "../../common/middlewares/authAccess";

const postsController = container.get(PostsController)
export const postRouter = Router();

postRouter
    .get("/", postsController.getPosts.bind(postsController))
    .get("/:id", postsController.getPostById.bind(postsController))
    .put(
        "/:id",
        basicAuthMiddleware,
        titleValidation,
        shortDescriptionValidator,
        contentValidator,
        inputValidationErrors,
        postsController.updatePost.bind(postsController),
    )
    .delete("/:id", basicAuthMiddleware, postsController.deletePost.bind(postsController))
    .post(
        "/",
        basicAuthMiddleware,
        blogIdValidator,
        titleValidation,
        shortDescriptionValidator,
        contentValidator,
        inputValidationErrors,
        postsController.createPost.bind(postsController),
    )
    .post('/:id/comments', contentValidation, accessTokenMiddleware, inputValidationErrors, postsController.createCommentByPostId.bind(postsController))
    .get('/:id/comments', checkAccess, postsController.getComments.bind(postsController))
    .put('/:id/like-status', postsController.addLike.bind(postsController))