import {BlogType, DataReqBodyType} from "../../../common/types/blogTypes/blogType";
import {BlogViewModel} from "../../../models/BlogViewModel";
import {blogsRepository} from "../repositories/blog.repository";
import {InsertOneResult} from "mongodb";
import {DataReqBodyPostType, PostType} from "../../../common/types/postTypse/postType";
import {queryBlogRepository} from "../queryRepository/query.blog.repository";
import {postRepository} from "../../posts/repositories/post.repository";


class BlogService {

    async createBlog(reqBody: DataReqBodyType): Promise<string> {
        const newBlog = {
            ...reqBody,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result: InsertOneResult<BlogType> = await blogsRepository.createBlog(newBlog)
        return result.insertedId.toString()

    }

    async updateBlog(reqBody: BlogType, id: string) {
        return await blogsRepository.updateBlog(reqBody, id)
    }

    async deleteBlog(id: string): Promise<boolean> {
        return await blogsRepository.deleteBlog(id)
    }

    async createPostByBlogId(reqBody: DataReqBodyPostType, blogId: string): Promise<string | null> {
        const blog: BlogViewModel | null = await queryBlogRepository.getBlog(blogId)
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

export const blogService = new BlogService()