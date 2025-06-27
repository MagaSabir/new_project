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
        const likes = await LikesModel.findOne({commentId: id, userId}).lean()
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt,
            likesInfo: {
                likesCount: comment.likesCount,
                dislikesCount: comment.dislikesCount,
                myStatus: likes ? likes.likeStatus : 'None',
            }
        }
    }

    async getComments(id: string, userId: string, pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any) {
        const totalCountPosts: number = await CommentModel.countDocuments({postId: id})


        const comments = await CommentModel
            .find({postId: id})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()

        const commentId = comments.map(l => l._id)
        const likes = await LikesModel.find({commentId: {$in: commentId}, userId}).lean()
        console.log(likes)
        const comment = comments.map((el: any) => {

            return {
                id: el._id.toString(),
                content: el.content,
                commentatorInfo: el.commentatorInfo,
                createdAt: el.createdAt,
                likesInfo: {
                    likesCount: el.likesCount,
                    dislikesCount: el.dislikesCount,
                    myStatus: likes ? likes.likeStatus : 'None',
                }


            }
        })

        return {
            pagesCount: Math.ceil(totalCountPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountPosts,
            items: comment
        }
    }
}

