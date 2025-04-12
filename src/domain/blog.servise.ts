import {BlogType, DataReqBodyType} from "../types/blogTypes/blogType";
import {BlogViewModel} from "../models/BlogViewModel";
import {blogRepository} from "../repositories/blog.repository";
import {InsertOneResult, ObjectId, WithId} from "mongodb";
import {DataReqBodyPostType, PostType} from "../types/postTypse/postType";
import {PostViewModel} from "../models/post.view.model";

export const blogService = {

    async getBlogsService(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any, searchNameTerm: any) {
        const {totalCountBlogs, blog} = await blogRepository.findBlogs(
            pageNumber,
            pageSize,
            sortDirection,
            sortBy,
            searchNameTerm
        );

        const blogs = blog.map((el) => {
            return {
                id: el._id.toString(),
                name: el.name,
                description: el.description,
                websiteUrl: el.websiteUrl,
                createdAt: el.createdAt,
                isMembership: el.isMembership
        }})
        return {
            pagesCount: Math.ceil(totalCountBlogs / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount:totalCountBlogs,
            items: blogs
        }
    },

    async getPostsService(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any, id: string) {

        const {totalCountPosts, posts} = await blogRepository.findPosts(pageNumber, pageSize, sortDirection, sortBy, id)
        if(!posts.length) {
            return null
        }
        const newPosts = posts.map((el) => {
            return {
                id: el._id.toString(),
                title: el.title,
                shortDescription: el.shortDescription,
                content: el.content,
                blogId: el.blogId,
                blogName: el.blogName,
                createdAt: el.createdAt
            }
        })
        return {
            pagesCount: Math.ceil(totalCountPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount:totalCountPosts,
            items: newPosts
        }
    },

    async getBlogService(id: string): Promise<BlogViewModel | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        const dbBlog: WithId<BlogType> | null = await blogRepository.findBlog(id)
        if(dbBlog) {
            return {
                id: dbBlog._id.toString(),
                name: dbBlog.name,
                description: dbBlog.description,
                websiteUrl: dbBlog.websiteUrl,
                createdAt: dbBlog.createdAt,
                isMembership: dbBlog.isMembership
            }
        } return null
    },

    async createBlogService(reqBody: DataReqBodyType): Promise<BlogViewModel> {
        const newBlog = {
            ...reqBody,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result: InsertOneResult<BlogType> = await blogRepository.createBlog(newBlog)
        return {
            id: result.insertedId.toString(),
            name: newBlog.name,
            description: newBlog.description,
            websiteUrl: newBlog.websiteUrl,
            createdAt: newBlog.createdAt,
            isMembership: newBlog.isMembership
        }
    },

    async putBlogService(reqBody: BlogType, id: string): Promise<boolean | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        return await blogRepository.updateBlog(reqBody, id)
    },

    async deleteBlogService(id: string): Promise<boolean> {
        return await blogRepository.deleteBlog(id)
    },

    async createPostByBlogIdService(reqBody: DataReqBodyPostType, blogId: string): Promise<PostViewModel | null> {
        if (!ObjectId.isValid(blogId)) {
            return null
        }

        const blog: WithId<BlogType>| null = await blogRepository.findBlog(blogId)

        if (!blog) {
            return null
        }
        const newPost = {
            ...reqBody,
            blogId: blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        const result: InsertOneResult<PostType> = await blogRepository.createPostByBlogId(newPost)

        return {
            id: result.insertedId.toString(),
            title: newPost.title,
            shortDescription: newPost.shortDescription,
            content: newPost.content,
            blogId: newPost.blogId,
            blogName: newPost.blogName,
            createdAt: newPost.createdAt,
        }
    }
}