import {STATUS_CODE} from "../core/http-statuses-code";
import {Request, Response} from "express";
import {db} from "../db/db.blogs";

export const postController = {
    getAllPost: (req:Request, res:Response) => {
        res.status(STATUS_CODE.OK).send(db.posts)
    }
}