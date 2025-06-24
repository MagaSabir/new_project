import {CommentRepository} from "../repositories/comment.repository";
import {injectable} from "inversify";
import {QueryRepoComment} from "../queryRepositories/query.repo.comment";
import {LikesModel, LikeType} from "../../../models/schemas/Likes.schema";

@injectable()
export class CommentService {
    constructor(protected commentRepository: CommentRepository,
                protected queryRepository: QueryRepoComment) {}

    async deleteCommentService(id: string) {
        return await this.commentRepository.deleteComment(id)
    }

    async updateComment(id: string, data: string) {
        return await this.commentRepository.updateComment(id, data)
    }

    async addLike(userId: string, commentId: string, likeStatus: any) {
        const comment = await this.queryRepository.getCommentById(commentId)
        console.log(comment+ ' a')
        if (!comment) return null
        const likeDoc = await LikesModel.findOne({userId, commentId});

        if(likeDoc) {
            if (likeDoc.likeStatus !== likeStatus) {
                likeDoc.likeStatus = likeStatus
                likeDoc.createdAt = new Date().toISOString()
                await likeDoc.save()
            }
            return true
        }
        const like = new LikesModel({userId, commentId, likeStatus: likeStatus, createdAt: new Date().toISOString()})
        await like.save()
        return true
    }
}