import {Request, Response} from "express";
import {queryPostRepository} from "../../posts/queryRepository/query.post.repository";
import {commentService} from "../services/comment.service";
import {STATUS_CODE} from "../../../common/utils/http-statuses-code";

export const commentController = {
    async getComment(req: Request, res: Response) {
        const comment = await queryPostRepository.getCommentById(req.params.id)
        console.log(comment)
        res.status(200).send(comment)
    },

    async deleteCommentByID(req: Request, res: Response) {
        const result = await commentService.deleteCommentService(req.params.id)
        if(!result) {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }
}