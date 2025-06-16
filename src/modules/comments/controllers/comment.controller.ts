import {Request, Response} from "express";
import {commentService} from "../services/comment.service";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";
import {queryRepoComment} from "../queryRepositories/query.repo.comment";
import request from "supertest";

export const commentController = {
    async getComment(req: Request, res: Response) {
       try {
           const comment = await queryRepoComment.getCommentById(req.params.id)
           if(!comment) {
               res.sendStatus(STATUS_CODE.NOT_FOUND_404)
               return
           }
           res.status(200).send(comment)

       } catch (error) {
           res.sendStatus(STATUS_CODE.SERVER_ERROR)
       }
    },


    async deleteCommentByID(req: Request, res: Response) {
        const comment = await queryRepoComment.getCommentById(req.params.id)
        if(!comment) {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }

        if(req.user!.id !== comment.commentatorInfo.userId) {
            res.sendStatus(403)
            return
        }
        await commentService.deleteCommentService(req.params.id)
        res.sendStatus(204)
    },

    async updateComment(req: Request, res: Response) {
        const comment = await queryRepoComment.getCommentById(req.params.id)
        if(!comment){
            console.log(comment)
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }
        if(req.user.id !== comment.commentatorInfo.userId) {
            res.sendStatus(403)
            return
        }
        await commentService.updateComment(req.params.id, req.body)
        res.sendStatus(204)
    },

    async like (req: Request, res: Response) {
        const status = await
    }
}