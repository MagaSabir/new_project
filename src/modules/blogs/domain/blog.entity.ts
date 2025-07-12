import mongoose, {HydratedDocument, Model} from "mongoose";
import {CreateBlogDto} from "../../../common/types/blogTypes/blogType";

export type BlogType = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean
}

type BlogStatics = typeof blogStatics
type BlogMethods = typeof blogMethods

type BlogModel = Model<BlogType, {}, BlogMethods> & BlogStatics

export type BlogDocument = HydratedDocument<BlogType, BlogMethods>

const blogSchema = new mongoose.Schema<BlogType, {}, BlogMethods, BlogModel>({
    name: {type: String, required: true, minlength: 2, maxlength: 15},
    description: {type: String, required: true, minLength: 1, maxlength: 500},
    websiteUrl: {type: String, required: true, minlength: 6, maxlength: 100},
    createdAt: {type: Date, default: Date.now},
    isMembership: {type: Boolean, default: false}
})

const blogStatics = {
    async createBlog(dto: CreateBlogDto) {
        return new BlogModel ({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
        })
    },


}

const blogMethods = {
    async updateBlog (dto: BlogType, id: string) {
        return new BlogModel ({
            name: dto.name,
            description: dto.description,
            websiteUrl: dto.websiteUrl,
        })
    }
}

blogSchema.statics = blogStatics
blogSchema.methods = blogMethods

export const BlogModel = mongoose.model<BlogType, BlogModel>('blogs', blogSchema)