import mongoose, {HydratedDocument, Model} from "mongoose";
import {CreateBlogDto} from "../../../common/types/blogTypes/blogType";
import {UpdateBlogDto} from "./blog.dto";

export type BlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean
}

type BlogStatics = typeof blogStatics

// interface BlogStatics {
//     createBlog(dto: CreateBlogDto): BlogDocument
// }

interface BlogMethods {
    updateBlog(this: BlogDocument, dto: Partial<BlogType>): void
}

// type BlogMethods = typeof blogMethods

type BlogModel = Model<BlogType, {}, BlogMethods> & BlogStatics

export type BlogDocument = HydratedDocument<BlogType, BlogMethods>

const blogSchema = new mongoose.Schema<BlogType, BlogModel, BlogMethods>({
    name: {type: String, required: true, minlength: 2, maxlength: 15},
    description: {type: String, required: true, minLength: 1, maxlength: 500},
    websiteUrl: {type: String, required: true, minlength: 6, maxlength: 100},
    createdAt: {type: Date, default: Date.now},
    isMembership: {type: Boolean, default: false}
})

const blogStatics = {
    createBlog(dto: CreateBlogDto): BlogDocument {
        const blog: BlogDocument = new BlogModel();
        blog.name = dto.name
        blog.description = dto.description
        blog.websiteUrl = dto.websiteUrl
        return blog
    },
}

const blogMethods: BlogMethods = {
    updateBlog(this: BlogDocument, dto: UpdateBlogDto) {
        this.name = dto.name ?? this.name
        this.description = dto.description ?? this.description
        this.websiteUrl = dto.websiteUrl ?? this.websiteUrl
    }
}

blogSchema.statics = blogStatics
blogSchema.methods = blogMethods

export const BlogModel = mongoose.model<BlogType, BlogModel>('blogs', blogSchema)