import {HydratedDocument, Schema} from "mongoose";
import mongoose from "mongoose";


export const blogSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    websiteUrl: { type: String, required: true },
    createdAt: { type: String, required: true, default: new Date().toISOString() },
    isMembership: { type: Boolean, required: true, default: false }
});

export type Blog = {
    name: string,
    description: string,
    websiteUrl: string,
    createdAt: string
    isMembership: boolean
}

export type BlogDocument = HydratedDocument<Blog>


export const BlogModel = mongoose.model('blogs', blogSchema)
