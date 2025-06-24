import {ObjectId} from "mongodb";
import {CommentModel} from "../../../models/schemas/Comment.schema";
import {injectable} from "inversify";
import {LikesModel} from "../../../models/schemas/Likes.schema";
@injectable()
export class CommentRepository  {
    async createPost (content: any) {
         const {_id} = await CommentModel.create(content)
        return _id
    }

    async deleteComment (id: string) {
        const result =  await CommentModel.deleteOne({_id: new ObjectId(id)})
        return  result.deletedCount === 1
    }

    async updateComment (id: string, data: any) {
        const result = await CommentModel
            .updateOne({_id: new ObjectId(id)}, {$set: data})
        return result.matchedCount === 1
    }


    async findLike (userId: string, commentId: string) {
        const result = await LikesModel.findOne({userId, commentId}).lean()
        return result
    }
}