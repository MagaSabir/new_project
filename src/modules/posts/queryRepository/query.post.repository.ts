import {PostLikes, PostModel} from "../../../models/schemas/Post.schema";

export class QueryPostRepository {
    async findPosts(userId: string, pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any,) {
        const totalCountPosts: number = await PostModel.countDocuments()

        console.log(userId)
        const posts = await PostModel
            .find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()

        const postIds = posts.map(post => post._id)

        const likes = await PostLikes.find({postId: {$in: postIds}, userId: userId}).lean()

        const post = posts.map(post => {
            console.log(likes)
            const matchedLikes = likes.find(l => l.postId.toString() === post._id.toString())
            console.log(matchedLikes)
            console.log('post  = ' + post._id)
            return {
                id: post._id.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId,
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: post.extendedLikesInfo?.likesCount ?? 0,
                    dislikesCount: post.extendedLikesInfo?.dislikesCount,
                    myStatus: matchedLikes?.likeStatus ?? 'None',
                    newestLikes: post.extendedLikesInfo?.newestLikes.map(like => ({
                        addedAt: like.addedAt,
                        userId: like.userId,
                        login: like.login
                    }))
                }
            }
        })
        return {

            pagesCount: Math.ceil(totalCountPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount: totalCountPosts,
            items: post
        }
    }

    async getPost(id: string, userId?: string | null) {
        const post = await PostModel.findById(id).lean()

        if (!post) return null
        const status = await PostLikes.findOne({postId: id, userId}).lean()

        return {
            id: post._id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo!.likesCount ?? 0,
                dislikesCount: post.extendedLikesInfo!.dislikesCount ?? 0,
                myStatus: status ? status.likeStatus : 'None',
                newestLikes: status ? [{
                    addedAt: status.addedAt,
                    userId: status.userId,
                    login: status.login
                }] : []
            }
        }
    }
}