import {postRepository} from "../repositories/post.repository";
import {blogRepository} from "../repositories/blog.repository";
import {InsertOneResult, ObjectId, WithId} from "mongodb";
import {PostViewModel} from "../models/post.view.model";
import {DataReqBodyPostType, PostType} from "../types/postTypse/postType";
import {BlogType} from "../types/blogTypes/blogType";

export const postService = {
    async getAllPostsService(pageNumber: number, pageSize: number, sortDirection: 1 | - 1, sortBy: any)  {
        const { posts, totalCountPosts } = await postRepository.findPosts(
            pageNumber,
            pageSize,
            sortDirection,
            sortBy,
        )

        const newPosts: PostViewModel[] = posts.map((el: WithId<PostType>): PostViewModel => {
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

    async getPostService (id: string): Promise<PostViewModel | null> {
        if(!ObjectId.isValid(id)){
            return null
        }
        const post: WithId<PostType> | null = await postRepository.findPost(id)
        if(post) {
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            }
        }
        return null

    },

    async createPostService (reqBody: DataReqBodyPostType): Promise<PostViewModel | null> {
        const blog: WithId<BlogType> | null = await blogRepository.findBlog(reqBody.blogId)
        if(!blog) {
            return null
        }
        const post = {
            title: reqBody.title,
            shortDescription: reqBody.shortDescription,
            content: reqBody.content,
            blogId: reqBody.blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        const result: InsertOneResult<PostType> = await postRepository.createPost(post)
        return {
            id: result.insertedId.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt
        }
    },

    async updatePostService (id: string, reqBody: PostType, ): Promise<boolean | null> {
        if(!ObjectId.isValid(id)) {
            return null
        }
        return  await postRepository.updatePost(id, reqBody)
    },

    async deletePostService (id: string): Promise<boolean> {
        return  await postRepository.deletePost(id)
    }
}