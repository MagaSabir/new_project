import {client, commentCollection, CommentType, postCollection} from "../../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {PostType} from "../../../common/types/postTypse/postType";
import {PostViewModel} from "../../../models/post.view.model";
import {postMapper} from "../../../common/adapters/mapper";

export const queryRepoComment = {
    async getCommentById(id: string) {
        const comment = await commentCollection.findOne({_id: new ObjectId(id)})
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
        const comments =  await commentCollection
            .find({postId: id})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        const comment = comments.map(el => {
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

