import {PostLikes, PostModel} from "../../../models/schemas/Post.schema";

export class QueryPostRepository {
    async findPosts(userId: string, pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any) {

        const totalCountPosts: number = await PostModel.countDocuments()

        const posts = await PostModel
            .find()
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()

        //[{ id: 1, title: post:1}, { id: 2, title: post2 { ]

        const postIds = posts.map(post => post._id)

        const userLikes = userId ? await PostLikes.find({postId: {$in: postIds}, userId: userId}).lean() : []
        const allLikes = await PostLikes.find({postId: {$in: postIds},likeStatus: 'Like'}).sort({addedAt: -1}).lean()
        const post = posts.map(post => {
            const lLikes = allLikes.filter(l => l.postId.toString() === post._id.toString()).slice(0, 3)

            const matchedLikes = userLikes.find(l => l.postId.toString() === post._id.toString())
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
                    dislikesCount: post.extendedLikesInfo?.dislikesCount ?? 0,
                    myStatus: matchedLikes?.likeStatus ?? 'None',
                    newestLikes: lLikes.map(l => ({
                        addedAt: l.addedAt,
                        userId: l.userId,
                        login: l.login
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

        const status = userId ? await PostLikes.findOne({postId: id, userId}).lean() : null
        const newestLikes = await PostLikes.find({postId: id, likeStatus: 'Like'}).sort({addedAt: -1}).limit(3).lean()

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
                dislikesCount: post.extendedLikesInfo?.dislikesCount ?? 0,
                myStatus: status ? status.likeStatus : 'None',
                newestLikes: newestLikes.map(l => {
                    return {
                        addedAt: l.addedAt,
                        login: l.login,
                        userId: l.userId
                    }
                })
            }
        }
    }
}
