import {db} from "../db/db.blogs";
import {Request, Response} from "express";
import {STATUS_CODE} from "../core/http-statuses-code";
import {errorsArray} from "../core/utils/errorMessage";

export const blogController = {
    getAllBlogs:  (req: Request, res: Response) => {
            res.status(STATUS_CODE.OK).json(db.blogs);
    },
    postController:  (req: Request, res: Response) => {
        const errors = errorsArray(req)
        if(errors.length) {
            res.status(STATUS_CODE.BAD_REQUEST).send({errorMessages: errors})
            return
        }
        const newBlog = {
            id: Math.floor(+new Date()).toString(),
            name: req.body.name,
            description: req.body.description,
            websiteUrl: req.body.websiteUrl
        }

        db.blogs.push(newBlog)
        res.status(STATUS_CODE.ACCEPTED).send(newBlog)
    }

};