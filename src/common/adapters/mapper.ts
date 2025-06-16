import {BlogType} from "../types/blogTypes/blogType";
import {WithId} from "mongodb";
import {BlogViewModel} from "../../models/view_models/BlogViewModel";
import {PostType} from "../types/postTypse/postType";
import {PostViewModel} from "../../models/view_models/post.view.model";

export const mapBlogToViewModel = (el: WithId<BlogType>): BlogViewModel => {
    return {
        id: el._id.toString(),
        name: el.name,
        description: el.description,
        websiteUrl: el.websiteUrl,
        createdAt: el.createdAt,
        isMembership: el.isMembership
    }
}

export const mapPostToViewModel = (el: WithId<PostType>): PostViewModel => {
    return {
        id: el._id.toString(),
        title: el.title,
        shortDescription: el.shortDescription,
        content: el.content,
        blogId: el.blogId,
        blogName: el.blogName,
        createdAt: el.createdAt
    }
}