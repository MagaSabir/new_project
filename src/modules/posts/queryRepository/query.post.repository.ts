import {postCollection} from "../../../db/mongoDb";
import {ObjectId, WithId} from "mongodb";
import {PostType} from "../../../common/types/postTypse/postType";
import {PostViewModel} from "../../../models/post.view.model";
import {mapPostToViewModel} from "../../../common/adapters/mapper";

export const queryPostRepository = {
    async findPosts(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any)  {
        const totalCountPosts: number = await postCollection.countDocuments()

        const posts: WithId<PostType>[] =  await postCollection
            .find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        const mappedPost: PostViewModel[] = posts.map(mapPostToViewModel)
        return {
            pagesCount: Math.ceil(totalCountPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount:totalCountPosts,
            items: mappedPost
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
}