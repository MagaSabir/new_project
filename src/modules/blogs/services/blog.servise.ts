import {BlogType, DataReqBodyType} from "../../../common/types/blogTypes/blogType";
import {BlogViewModel} from "../../../models/BlogViewModel";
import {blogRepository} from "../repositories/blog.repository";
import {InsertOneResult} from "mongodb";
import {DataReqBodyPostType, PostType} from "../../../common/types/postTypse/postType";
import {queryBlogRepository} from "../queryRepository/query.blog.repository";
import {postRepository} from "../../posts/repositories/post.repository";

export const blogService = {

    async createBlogService(reqBody: DataReqBodyType): Promise<string> {
        const newBlog = {
            ...reqBody,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result: InsertOneResult<BlogType> = await blogRepository.createBlog(newBlog)
        return  result.insertedId.toString()

    },

    async putBlogService(reqBody: BlogType, id: string): Promise<boolean | null> {
        return await blogRepository.updateBlog(reqBody, id)
    },

    async deleteBlogService(id: string): Promise<boolean> {
        return await blogRepository.deleteBlog(id)
    },

    async createPostByBlogIdService(reqBody: DataReqBodyPostType, blogId: string): Promise<string | null> {
        const blog: BlogViewModel| null = await queryBlogRepository.findBlog(blogId)
        if (!blog) return null
        const newPost = {
            ...reqBody,
            blogId: blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        const result: InsertOneResult<PostType> = await postRepository.createPost(newPost)
        return result.insertedId.toString()
    }
}