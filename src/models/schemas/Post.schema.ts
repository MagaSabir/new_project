import mongoose, {HydratedDocument, model, Schema} from "mongoose";


const newestLike = new Schema({
    addedtAt: {type: Date, required: true},
    userId: {type: String, required: true},
    login: {type: String, required: true}
}, {_id: false})

const  likesSchema =  new Schema({
    likesCount: {type: Number},
    dislikesCount: {type: Number},
    newestLikes: {type: [newestLike]},
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
    createdAt: string
}

export type PostDocument = HydratedDocument<PostType>
export const PostModel = mongoose.model<PostType>('posts', postSchema)