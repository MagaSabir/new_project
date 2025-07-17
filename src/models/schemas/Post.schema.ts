import mongoose, {Schema} from "mongoose";


interface PostLikes {
    postId: string,
    userId: string,
    login: string,
    likeStatus: 'Like' | 'Dislike' | 'None'
    addedAt: Date
}

const postLikes = new Schema<PostLikes>({
    postId: {type: String, required: true},
    userId: {type: String, required: true},
    login: {type: String, required: true},
    likeStatus: {type: String, enum: ['Like', 'Dislike', 'None'], required: true, default: 'None'},
    addedAt: {type: Date, default: Date.now() }
})

export const PostLikes = mongoose.model<PostLikes>('postLikes', postLikes)

