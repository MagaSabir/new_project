import mongoose, {Schema} from "mongoose";

export type LikeType = {
    commentId: string,
    userId: string,
    likeStatus: string
}

export enum LikeStatus {
    LIKE = 'Like',
    DISLIKE = 'Dislike',
    NONE = 'None'
}



const likeSchema = new Schema({
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    likeStatus: { type: String, enum: LikeStatus, required: true},
    createdAt: { type: Date, default: Date.now() }
})

export const LikesModel = mongoose.model('likes', likeSchema)

