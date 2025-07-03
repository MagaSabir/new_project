import mongoose, {HydratedDocument, Schema} from "mongoose";
import {ObjectId} from "mongodb";

interface PostLikes {
    postId: string,
    userId: string,
    login: string,
    likeStatus: 'Like' | 'Dislike' | 'None',
    addedAt: Date
}

const postLikes = new Schema({
    postId: {type: ObjectId, required: true},
    userId: {type: ObjectId, required: true},
    login: {type: String, required: true},
    likeStatus: {type: String, enum: ['Like', 'Dislike', 'None']},
    addedAt: {type: Date, default: Date.now() }
})

export const PostLikes = mongoose.model<PostLikes>('postLikes', postLikes)


//PostModel


const newestLikeSchema = new Schema({
    addedAt: {type: Date, required: true},
    userId: {type: ObjectId, required: true},
    login: {type: String, required: true}
}, {_id: false})


const likesSchema = new Schema({
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    newestLikes: {type: [newestLikeSchema], default: []},
}, {_id: false})


export const postSchema = new Schema({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    extendedLikesInfo: {type: likesSchema}
}, {timestamps: {createdAt: true, updatedAt: false}})

export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: string,
    extendedLikesInfo: {
        likesCount: number,
        dislikeCount: number,
        myStatus: 'Like' | 'Dislike' | 'None',
        newestLikes: [{
            addedAt: Date,
            userId: string,
            login: string
        }]
    }
}

export type PostDocument = HydratedDocument<PostType>
export const PostModel = mongoose.model('posts', postSchema)