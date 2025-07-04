import {ObjectId} from "mongodb";
import {QueryBlogsRepository} from "../../blogs/queryRepository/query.blog.repository";
import {BlogType} from "../../../models/schemas/Blog.schema";
import {PostLikes, PostModel, PostType} from "../../../models/schemas/Post.schema";
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
            createdAt: new Date().toISOString(),

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


    async addLike(postId: string, userId: string, likeStatus: LikeStatus, login: string) {
        const post = await this.queryPostRepository.getPost(postId)

        const addedAt = new Date()
        if (!post) return false

        const existing = await PostLikes.findOne({userId, postId})

        if (existing) {
            existing.likeStatus = likeStatus
            existing.addedAt = addedAt
            await existing.save()
        } else {
            await PostLikes.create({postId, userId, likeStatus, login})
        }
        const [likes, dislikes] = await Promise.all([
            PostLikes.countDocuments({postId, likeStatus: 'Like'}),
            PostLikes.countDocuments({postId, likeStatus: 'Dislike'})
        ])
        console.log(likes)

        await PostModel.updateOne({_id: postId}, {$set: {"extendedLikesInfo.likesCount": likes, "extendedLikesInfo.dislikesCount": dislikes}})
    return true
    }
}


