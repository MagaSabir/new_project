import {ObjectId} from "mongodb";
import {QueryBlogsRepository} from "../../blogs/infrasctructure/query.blog.repository";
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
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                newestLikes: []
            }

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


        console.log(newestLikes)
        await PostModel.updateOne({_id: postId}, {
            $set: {
                "extendedLikesInfo.likesCount": likes,
                "extendedLikesInfo.dislikesCount": dislikes,
            }
        })
        return true
    }
}


