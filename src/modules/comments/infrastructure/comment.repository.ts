import {ObjectId} from "mongodb";
import {injectable} from "inversify";
import {LikesModel} from "../../../models/schemas/Likes.schema";
import {CommentModel} from "../domain/comment.entity";

@injectable()
export class CommentRepository {
    async createPost(content: any) {
        const {_id} = await CommentModel.create(content)
        return _id
    }

    async deleteComment(id: string) {
        const result = await CommentModel.deleteOne({_id: new ObjectId(id)})
        return result.deletedCount === 1
    }

    async updateComment(id: string, data: any) {
        const result = await CommentModel.updateOne({_id: new ObjectId(id)}, {$set: data})
        return result.matchedCount === 1
    }


    async saveLike(existingLike: any) {
        await existingLike.save();
    }

    async createLike(userId: string, commentId: string, likeStatus: LikeStatus) {
        await LikesModel.create({userId, commentId, likeStatus})
    }

    async updateLikesCount(commentId: string) {
        const likes = await LikesModel.countDocuments({commentId, likeStatus: 'Like'})
        const dislike = await LikesModel.countDocuments({commentId, likeStatus: 'Dislike'})

        await CommentModel.updateOne({_id: commentId}, {$set: {likesCount: likes, dislikesCount: dislike}})

    }
}

export type LikeStatus = 'Like' | 'Dislike' | 'None'