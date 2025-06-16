import {commentCollection} from "../../../db/mongoDb";

import {ObjectId, WithId} from "mongodb";
import {CommentType} from "../../../models/view_models/CommentModel";

export const queryRepoComment = {
    async getCommentById(id: string) {
        const comment: WithId<CommentType> | null = await commentCollection.findOne({_id: new ObjectId(id)})
        if(!comment) return null
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt
        }
    },

    async getComments(id: string, pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any)  {
        const totalCountPosts: number = await commentCollection.countDocuments({postId: id})
        const comments: WithId<CommentType>[] =  await commentCollection
            .find({postId: id})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        const comment: CommentType[] = comments.map(el => {
            return {
                id: el._id.toString(),
                content: el.content,
                commentatorInfo: el.commentatorInfo,
                createdAt: el.createdAt
            }
        })
        return {
            pagesCount: Math.ceil(totalCountPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount:totalCountPosts,
            items: comment
        }
    },
}

