import {Request, Response} from "express";
import {STATUS_CODE} from "../core/http-statuses-code";
import {errorsArray} from "../core/utils/errorMessage";
import {blogRepository} from "../repositories/blog.repository";
import {postRepository} from "../repositories/post.repository";
import {PostType} from "../types/postTypse/postType";

export const postController = {
    getAllPosts:  (req: Request, res: Response) => {
        const posts: PostType[] = postRepository.findPosts()
        res.status(STATUS_CODE.OK).send(posts);
    },

    getPostById: (req: Request, res: Response) => {
        const blog: PostType | undefined = postRepository.findPost(req.params.id)
        if(!blog) {
            res.sendStatus(STATUS_CODE.NOT_FOUND)
            return
        }
        res.status(STATUS_CODE.OK).send(blog)
    },

    postController:  (req: Request, res: Response) => {
        const errors: ErrorMessageType[] = errorsArray(req)
        if(errors.length) {
            res.status(STATUS_CODE.BAD_REQUEST).send({errorsMessages: errors})
            return
        }
        const blog= blogRepository.findBlog(req.body.blogId)
    if(blog) {

        const newPost: PostType = {
            id: Math.floor(+new Date()).toString(),
            title: req.body.title,
            shortDescription: req.body.shortDescription,
            content: req.body.content,
            blogId: req.body.blogId,
            blogName: blog.name

        }
        postRepository.createPost(newPost)
        res.status(STATUS_CODE.CREATED).send(newPost)
    }

    },

    putController: (req: Request, res: Response) => {
        const errors: ErrorMessageType[] = errorsArray(req)
        const post = postRepository.findPost(req.params.id)
        if(errors.length) {
            res.status(STATUS_CODE.BAD_REQUEST).send({errorsMessages: errors})
            return
        }
        if(!post) {
            res.sendStatus(STATUS_CODE.NOT_FOUND)
            return;
        }
        postRepository.updatePost(req.body, req.params.id)
        res.sendStatus(STATUS_CODE.NO_CONTENT)
    },

    deleteController: (req: Request, res: Response) => {
        const post = postRepository.findPost(req.params.id)
        if(!post) {
            res.sendStatus(STATUS_CODE.NOT_FOUND)
            return
        }
        postRepository.deletePost(req.params.id)
        res.sendStatus(STATUS_CODE.NO_CONTENT)
    }
};


type ErrorMessageType = {
    message: string,
    field: string,
}