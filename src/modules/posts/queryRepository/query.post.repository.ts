import {client, postCollection} from "../../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {PostType} from "../../../common/types/postTypse/postType";
import {PostViewModel} from "../../../models/post.view.model";
import {postMapper} from "../../../common/utils/mapper";

export const queryPostRepository = {
    async findPosts(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any)  {
        const totalCountPosts: number = await postCollection.countDocuments()

        const posts: WithId<PostType>[] =  await postCollection
            .find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        const newPosts: PostViewModel[] = posts.map((el: WithId<PostType>): PostViewModel => {
            return postMapper(el)
        })
        return {
            pagesCount: Math.ceil(totalCountPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount:totalCountPosts,
            items: newPosts
        }
    },

    async findPost(id: string): Promise<PostViewModel | null> {
        const post: WithId<PostType> | null =  await postCollection.findOne({_id: new ObjectId(id)})
        if(post) {
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt
            }
        }
        return null
    },

    async getCommentById(id: string) {
        const comment = await client.db('blogPlatform').collection('comments').findOne({_id: new ObjectId(id)})
        if(!comment) return null
        return {
            id: comment._id.toString(),
            content: comment.content,
            commentatorInfo: comment.commentatorInfo,
            createdAt: comment.createdAt

        }
    }
}