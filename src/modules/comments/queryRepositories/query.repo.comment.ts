import {WithId} from "mongodb";
import {CommentType} from "../../../models/view_models/CommentModel";
import {CommentModel} from "../../../models/schemas/Comment.schema";
import {injectable} from "inversify";
import {LikesModel} from "../../../models/schemas/Likes.schema";

@injectable()
export class QueryRepoComment {
    async getCommentById(id: string, userId?: string) {
        const comment: WithId<CommentType> | null = await CommentModel.findById(id)

        if (!comment) return null
        const likes = await LikesModel.findOne({commentId: id, userId: comment.commentatorInfo.userId}).lean()
        console.log(comment)
        if (likes) {


            const statusLikes = await LikesModel.countDocuments({commentId: id, likeStatus: 'Like'})
            const statusDislikes = await LikesModel.countDocuments({commentId: id, likeStatus: 'Dislike'})


            return {
                id: comment._id.toString(),
                content: comment.content,
                commentatorInfo: comment.commentatorInfo,
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: statusLikes,
                    dislikes: statusDislikes,
                    myStatus: likes.likeStatus
                }
            }
        }
        return await new CommentModel({})
    }

    async getComments(id: string, pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any) {
        const totalCountPosts: number = await CommentModel.countDocuments({postId: id})


        const comments = await CommentModel
            .find({postId: id})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()

        const commentId = comments.map(l => l._id)
        const likes = await LikesModel.find({
            commentId: { $in: commentId }
        }).lean();

        const result = comments.map(comment => {
            const commentLikes = likes.filter(l => l.commentId === comment._id.toString()).length


        })
        const likesCount = await LikesModel.countDocuments({commentId, likeStatus: 'Like'})
        const dislikesCount = await LikesModel.countDocuments({commentId, likeStatus: 'Dislike'})

        const comment: CommentType[] = comments.map(el => {

            return {
                id: el._id.toString(),
                content: el.content,
                commentatorInfo: el.commentatorInfo,
                createdAt: el.createdAt,
            }
        })

        console.log(comment)


        return {
            pagesCount: Math.ceil(totalCountPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountPosts,
            items: comment
        }
    }
}

