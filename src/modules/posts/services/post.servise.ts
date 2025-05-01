import {postRepository} from "../repositories/post.repository";
import {InsertOneResult, ObjectId} from "mongodb";
import {DataReqBodyPostType, PostType} from "../../../common/types/postTypse/postType";
import {queryBlogRepository} from "../../blogs/queryRepository/query.blog.repository";
import {BlogViewModel} from "../../../models/BlogViewModel";
import {queryPostRepository} from "../queryRepository/query.post.repository";
import {CommentType} from "../../../models/CommentModel";

export const postService = {
    async createPostService (reqBody: DataReqBodyPostType): Promise<string | null> {
        const blog: BlogViewModel | null = await queryBlogRepository.findBlog(reqBody.blogId)
        if(!blog) {
            return null
        }
        const post = {
            ...reqBody,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        const result: InsertOneResult<PostType> = await postRepository.createPost(post)
        return result.insertedId.toString()
    },

    async updatePostService (id: string, reqBody: PostType, ): Promise<boolean | null> {
        if(!ObjectId.isValid(id)) {
            return null
        }
        return  await postRepository.updatePost(id, reqBody)
    },

    async deletePostService (id: string): Promise<boolean> {
        return  await postRepository.deletePost(id)
    },

    async createPostService (id: string, data: CommentType) {
        const result = await queryPostRepository.findPost(id)
        if(!result) return null
    }
}


