import {commentRepository} from "../repositories/comment.repository";

export const commentService = {
    async deleteCommentService (id: string) {
        return  await commentRepository.deleteComment(id)
    },

    async updateComment (id: string, data: string) {
        return await commentRepository.updateComment(id, data)
    }
}