import {CreatePostDto} from "./post.dto";
import mongoose, {HydratedDocument, Model} from "mongoose";
import {BlogViewModel} from "../../../models/view_models/BlogViewModel";

export type PostType = {
    title: string,
    shortDescription: string,
    content: string,
    blogId: string,
    blogName: string,
    createdAt: Date,
    extendedLikesInfo: {
        likesCount: number,
        dislikesCount: number,
        myStatus: string,
        newestLikes: Array<object>
    }
}

type NewestLikesType = {
    addedAt: Date,
    userId: string,
    login: string
}

type LikeType = {
    likesCount: number,
    dislikesCount: number,
    newestLikes: [NewestLikesType]
}

// interface PostStatics {
//     createPost(dto: CreatePostDto, blog: any): PostDocument
// }

type PostStatics = typeof postStatics

interface PostMethods {
    updatePost(dto: CreatePostDto): void
}

type PostModel = Model<PostType, {}, PostMethods> & PostStatics

export type PostDocument = HydratedDocument<PostType, PostMethods>

const newestLikeSchema = new mongoose.Schema<NewestLikesType>({
    addedAt: {type: Date, required: true},
    userId: {type: String, required: true},
    login: {type: String, required: true}
})


const likesSchema = new mongoose.Schema<LikeType>({
    likesCount: {type: Number, default: 0},
    dislikesCount: {type: Number, default: 0},
    newestLikes: {type: [newestLikeSchema], default: []},
})

const postSchema = new mongoose.Schema<PostType, PostModel, PostMethods>({
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String},
    blogName: {type: String},
    createdAt: {type: Date, default: Date.now},
    extendedLikesInfo: {type: likesSchema}
})

const postStatics = {
    createPost(dto: CreatePostDto, blog: BlogViewModel): PostDocument {
        const post: PostDocument = new PostModel(dto)
        post.title = dto.title
        post.shortDescription = dto.shortDescription
        post.content = dto.content
        post.blogId = blog.id
        post.blogName = blog.name
        return post
    }
}

const postMethods = {
    updatePost(dto: CreatePostDto) {
    }
}

postSchema.statics = postStatics
postSchema.methods = postMethods

export const PostModel = mongoose.model<PostType, PostModel>('posts', postSchema)