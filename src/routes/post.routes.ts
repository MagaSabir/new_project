import {Router} from "express";
import {SETTINGS} from "../settings";
import {postController} from "../controllers/post.controller";

export const postRouter = Router()

postRouter.get(SETTINGS.PATH.posts, postController.getAllPost)