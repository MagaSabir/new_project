import {ObjectId} from "mongodb";
import {QueryBlogsRepository} from "../../blogs/infrasctructure/query.blog.repository";
import {PostRepository} from "../infrastructure/post.repository";
import {injectable} from "inversify";
import {CommentRepository, LikeStatus} from "../../comments/repositories/comment.repository";
import {QueryPostRepository} from "../infrastructure/query.post.repository";
import {PostDocument, PostModel, PostType} from "../domain/post.entity";
import {CreatePostDto} from "../domain/post.dto";
import {PostLikes} from "../../../models/schemas/Post.schema";
import {BlogViewModel} from "../../../models/view_models/BlogViewModel";

@injectable()
export class PostsService {
    constructor(
        protected postRepository: PostRepository,
        protected queryBlogRepository: QueryBlogsRepository,
        protected commentRepository: CommentRepository,
        protected queryPostRepository: QueryPostRepository) {
    }

    async createPostService(dto: CreatePostDto): Promise<string | null> {
        const blog: BlogViewModel | null = await this.queryBlogRepository.getBlog(dto.blogId)
        if (!blog) return null
        const post: PostDocument = PostModel.createPost(dto, blog)
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
        const post = await this.queryPostRepository.getPost(postId, userId)


        if (!post) return false

        const existing = await PostLikes.findOne({userId, postId})


        if (existing) {
            if (existing.likeStatus !== likeStatus) {
                existing.likeStatus = likeStatus
                existing.addedAt = new Date()
                await existing.save()
            }

        } else {
            await PostLikes.create({postId, userId, likeStatus, login, addedAt: new Date()})
        }
        const [likes, dislikes, newestLikes] = await Promise.all([
            PostLikes.countDocuments({postId, likeStatus: 'Like'}),
            PostLikes.countDocuments({postId, likeStatus: 'Dislike'}),
            PostLikes.findOne({postId: postId, userId: userId})
        ])

        // const newestLikes = await PostLikes.findOne({postId: postId, userId: userId})

        await PostModel.updateOne({_id: postId}, {
            $set: {
                "extendedLikesInfo.likesCount": likes,
                "extendedLikesInfo.dislikesCount": dislikes,
            }
        })
        return true
    }
}


