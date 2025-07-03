import {ObjectId, WithId} from "mongodb";
import {PostViewModel} from "../../../models/view_models/post.view.model";
import {mapPostToViewModel} from "../../../common/adapters/mapper";
import {PostDocument, PostLikes, PostModel, PostType} from "../../../models/schemas/Post.schema";

export class QueryPostRepository  {
    async findPosts(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any, )  {
        const totalCountPosts: number = await PostModel.countDocuments()


        const posts: WithId<PostType>[] =  await PostModel
            .find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()

        const mappedPost: PostViewModel[] = posts.map(mapPostToViewModel)
        return {
            pagesCount: Math.ceil(totalCountPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount:totalCountPosts,
            items: posts
        }
    }

    async getPost(id: string, userId) {
        const post =  await PostModel.findById(id).lean()
        console.log(post)
        const likesInfo = await PostLikes.findOne({postId: id}).lean()
        console.log(likesInfo)
        if(!likesInfo) return null
        if(post) {
            return {
                id: post._id,
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.extendedLikesInfo!.likesCount,
                    dislikesCount: post.extendedLikesInfo!.dislikesCount,
                    myStatus: likesInfo.likeStatus ? likesInfo.likeStatus : 'None'
                }
            }
        }
        return null
    }
}