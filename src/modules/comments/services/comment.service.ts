import {commentRepository} from "../repositories/comment.repository";

export const commentService = {
    async createCommentService (data: string) {
        const content = {
            content: data
        }
        const result = await commentRepository.createPost(content)
    }
}