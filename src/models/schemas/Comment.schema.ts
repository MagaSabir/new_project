import mongoose, {Schema} from "mongoose";

export type CommentType = {
    content: string,
    commentatorInfo: {
        userId: string,
        userLogin: string
    },
    createdAt: string
}


export const commentSchema = new Schema({
    content: {type: String, required: true},
    postId: {type: String, required: true},
    commentatorInfo: {
        userId: {type: String, required: true},
        userLogin: {type: String, required: true}
    },
    createdAt: {type: String, required: true},
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},

}, {
    timestamps: {createdAt: true, updatedAt: false}
})



export const CommentModel = mongoose.model('comments', commentSchema)

