import {Request, Response} from "express";
import {STATUS_CODE} from "../core/http-statuses-code";
import {errorsArray} from "../core/utils/errorMessage";
import {blogRepository} from "../repositories/blog.repository";
import {BlogType} from "../types/blogTypes/blogType";

export const blogController = {
    getAllBlogs:  (req: Request, res: Response) => {
        const blogs: BlogType[] = blogRepository.findBlogs()
            res.status(STATUS_CODE.OK).send(blogs);
    },

    getBlogById: (req: Request, res: Response) => {
        const blog: BlogType | undefined = blogRepository.findBlog(req.params.id)
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
        const newBlog = {
            id: Math.floor(+new Date()).toString(),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }
        blogRepository.createBlog(newBlog)
        res.status(STATUS_CODE.CREATED).send(newBlog)
    },

    putController: (req: Request, res: Response) => {
        const errors: ErrorMessageType[] = errorsArray(req)
        const blog = blogRepository.findBlog(req.params.id)
        if(errors.length) {
            res.status(STATUS_CODE.BAD_REQUEST).send({errorsMessages: errors})
            return
        }
        if(!blog) {
            res.sendStatus(STATUS_CODE.NOT_FOUND)
        }
        blogRepository.updateBlog(req.body, req.params.id)
        res.sendStatus(STATUS_CODE.NO_CONTENT)
    },

    deleteController: (req: Request, res: Response) => {
        const blog = blogRepository.findBlog(req.params.id)
        if(!blog) {
            res.sendStatus(STATUS_CODE.NOT_FOUND)
            return
        }
        blogRepository.deleteBlog(req.params.id)
        res.sendStatus(STATUS_CODE.NO_CONTENT)
    }
};


type ErrorMessageType = {
    message: string,
    field: string,
}