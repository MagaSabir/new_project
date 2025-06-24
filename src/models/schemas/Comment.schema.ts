import mongoose, {HydratedDocument, Schema} from "mongoose";

export type CommentType = {
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}


const likeSchema = new Schema({
        likesCount: { type: Number, default: 0 },
        dislikesCount:{ type: Number, default: 0 },
        myStatus: {type: String, enum: ['Like', 'Dislike', 'None'], default: 'None'}
})

export const commentSchema = new Schema({
    content: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    },
    createdAt: {type: String, required: true},
    likeInfo: { type: likeSchema }
}, {
    timestamps: {createdAt: true, updatedAt: false}
})

export type CommentDocument = HydratedDocument<CommentType>

export const CommentModel = mongoose.model<CommentType>('comments', commentSchema)

