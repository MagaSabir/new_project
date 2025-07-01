import {InsertOneResult, ObjectId} from "mongodb";
import {QueryBlogsRepository} from "../../blogs/queryRepository/query.blog.repository";
import {BlogType} from "../../../models/schemas/Blog.schema";
import {PostModel, PostType} from "../../../models/schemas/Post.schema";
import {PostRepository} from "../repositories/post.repository";
import {injectable} from "inversify";
import {CommentRepository, LikeStatus} from "../../comments/repositories/comment.repository";
import {QueryPostRepository} from "../queryRepository/query.post.repository";

@injectable()
export class PostsService {
    constructor(
        protected postRepository: PostRepository,
        protected queryBlogRepository: QueryBlogsRepository,
        protected commentRepository: CommentRepository,
        protected queryPostRepository: QueryPostRepository) {
    }

    async createPostService(dto: PostType): Promise<string | null> {
        const blog: BlogType | null = await this.queryBlogRepository.getBlog(dto.blogId)
        if (!blog) {
            return null
        }
        const newPost = {
            ...dto,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        const post = new PostModel(newPost)
        return await this.postRepository.save(post)
    }

    async updatePostService(id: string, reqBody: PostType,): Promise<boolean | null> {
        if (!ObjectId.isValid(id)) {
            return null
        }
        return await this.postRepository.updatePost(id, reqBody)
    }

    async deletePostService(id: string): Promise<boolean> {
        return await this.postRepository.deletePost(id)
    }

    async createCommentById(content: string, user: any, id: string) {
        const comment = {
            content,
            postId: id,
            commentatorInfo: {
                userId: user.id,
                userLogin: user.login
            },
            createdAt: new Date().toISOString()
        }
        const result = await this.commentRepository.createPost(comment)

        return result.toString()
    }


    async addLike(id: string, status: LikeStatus) {
        const post = await this.queryPostRepository.getPost(id)
        if(!post) return null


    }
}


