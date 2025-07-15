import {CommentRepository, LikeStatus} from "../infrastructure/comment.repository";
import {injectable} from "inversify";
import {QueryRepoComment} from "../infrastructure/query.repo.comment";
import {LikesModel} from "../../../models/schemas/Likes.schema";
import {ResultStatus} from "../../../common/types/resultStatuse";

@injectable()
export class CommentService {
    constructor(protected commentRepository: CommentRepository,
                protected queryRepository: QueryRepoComment) {
    }

    async deleteCommentService(id: string) {
        return await this.commentRepository.deleteComment(id)
    }

    async updateComment(id: string, data: string) {
        return await this.commentRepository.updateComment(id, data)
    }

    async setLikeStatus(userId: string, commentId: string, likeStatus: LikeStatus) {
        const comment = await this.queryRepository.getCommentById(commentId)
        if (!comment) {
            return {
                status: ResultStatus.NotFound
            }
        }

        const existing = await LikesModel.findOne({userId, commentId})

        if (existing) {
            if(existing.likeStatus !== likeStatus) {
                existing.likeStatus = likeStatus
                existing.createdAt = new Date()
                await this.commentRepository.saveLike(existing)
            }
        } else {
            await this.commentRepository.createLike(userId, commentId, likeStatus)
        }


        await this.commentRepository.updateLikesCount(commentId)
         return {
            status: ResultStatus.NotContent
         }
    }
}