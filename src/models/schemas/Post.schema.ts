import mongoose, {HydratedDocument, model, Schema} from "mongoose";

// export type PostViewModel = {
//     id: string,
//     title: string,
//     shortDescription: string,
//     content: string,
//     blogId: string,
//     blogName: string
//     createdAt: string
// }


export const postSchema = new Schema({
    title: { type: String, required: true },
    shortDescription: { type: String, required: true},
    content: { type: String, required: true },
    blogId: { type: String, required: true },
    blogName: {type: String, required: true }
}, { timestamps: {createdAt: true, updatedAt: false}})

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