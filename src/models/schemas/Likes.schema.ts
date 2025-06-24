import mongoose, {Schema} from "mongoose";

export type LikeType = {
    commentId: string,
    userId: string,
    likeStatus: string
}

const likeSchema = new Schema({
    commentId: { type: String, required: true },
    userId: { type: String, required: true },
    likeStatus: { type: String, enum: ['Like, Dislike, None'], required: true},
    createdAt: { type: Date, default: Date.now }
})

export const LikesModel = mongoose.model('likes', likeSchema)