import {commentRepository} from "../repositories/comment.repository";

export const commentService = {
    async deleteCommentService (id: string) {
        return  await commentRepository.deleteComment(id)
    }
}