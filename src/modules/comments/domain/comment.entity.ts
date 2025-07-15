import mongoose, {HydratedDocument, Model} from "mongoose";


export type CommentType = {
    content: string,
    postId: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: Date,
    likesCount: number,
    dislikesCount: number
}
type CommentModel = Model<CommentType>

export type CommentDocument = HydratedDocument<CommentType>

 const commentSchema = new mongoose.Schema<CommentType>({
    content: {type: String, required: true},
    postId: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    },
    createdAt: {type: Date, required: true, default: Date.now},
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},

})

export const CommentModel = mongoose.model<CommentType, CommentModel>('comments', commentSchema)