import {Request, Response} from "express";
import {CommentService} from "../services/comment.service";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";
import {QueryRepoComment} from "../queryRepositories/query.repo.comment";
import {injectable} from "inversify";
import {ResultStatus} from "../../../common/types/resultStatuse";

@injectable()
export class CommentController {
    constructor(protected commentService: CommentService,
                protected queryCommentRepository: QueryRepoComment) {
    }

    async getComment(req: Request, res: Response) {
        try {
            // let userId
            // if(req.user) {
            //     userId = req.user.id
            // } else {
            //     userId = 'None'
            // }

            const userId = req.user?.id ?? null
            const comment = await this.queryCommentRepository.getCommentById(req.params.id, userId)

            if (!comment) {
                res.sendStatus(STATUS_CODE.NOT_FOUND_404)
                return
            }
            res.status(200).send(comment)
            return

        } catch (error) {
            console.log(error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR)

        }
    }


    async deleteCommentByID(req: Request, res: Response) {
        const comment = await this.queryCommentRepository.getCommentById(req.params.id)
        if (!comment) {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }

        if (req.user.id !== comment.commentatorInfo.userId) {
            res.sendStatus(403)
            return
        }
        await this.commentService.deleteCommentService(req.params.id)
        res.sendStatus(204)
    }

    async updateComment(req: Request, res: Response) {
        const comment = await this.queryCommentRepository.getCommentById(req.params.id)
        if (!comment) {
            console.log(comment)
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }
        if (req.user.id !== comment.commentatorInfo.userId) {
            res.sendStatus(403)
            return
        }
        await this.commentService.updateComment(req.params.id, req.body)
        res.sendStatus(204)
    }

    async setLike(req: Request, res: Response) {
        const {likeStatus} = req.body
        const commentId = req.params.id
        const userId = req.user.id


        const result = await this.commentService.setLikeStatus(userId, commentId, likeStatus)
        if (result.status === ResultStatus.NotFound) {
            res.sendStatus(404)
            return
        }
        res.sendStatus(204)
    }
}