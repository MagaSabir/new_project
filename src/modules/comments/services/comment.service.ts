import {CommentRepository} from "../repositories/comment.repository";
import {injectable} from "inversify";

@injectable()
export class CommentService {
    constructor(protected commentRepository: CommentRepository) {
    }

    async deleteCommentService(id: string) {
        return await this.commentRepository.deleteComment(id)
    }

    async updateComment(id: string, data: string) {
        return await this.commentRepository.updateComment(id, data)
    }

    async addLike(status: string, id: string) {
        const result = await this.commentRepository.addLike(status, id)
        console.log(result)
    }
}