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

    async addLike(userId: string, commentId: string, likeStatus: string) {
        const like = await this.commentRepository.findLike(userId, commentId)
        console.log(like)
        const newLike = new LikesModel({userId, commentId, likeStatus: likeStatus})
        await newLike.save();
        return {created: true}
    }
}