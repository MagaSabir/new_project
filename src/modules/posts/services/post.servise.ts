import {postRepository} from "../repositories/post.repository";
import {InsertOneResult, ObjectId} from "mongodb";
import {DataReqBodyPostType, PostType} from "../../../common/types/postTypse/postType";
import {queryBlogRepository} from "../../blogs/queryRepository/query.blog.repository";
import {BlogViewModel} from "../../../models/BlogViewModel";
import {queryPostRepository} from "../queryRepository/query.post.repository";
import {CommentType} from "../../../models/CommentModel";
import {contentValidator} from "../../../common/middlewares/blogValidation/posts.validations";
import {commentRepository} from "../../comments/repositories/comment.repository";

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

    async createCommentById (content:string, user: any) {
        const comment = {
            content,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString()
        }
        const result = await commentRepository.createPost(comment)

        return result.insertedId.toString()
    }

}


