import {ObjectId} from "mongodb";
import {BlogQuery} from "../../../common/types/blogTypes/blogType";
import {mapBlogToViewModel} from "../../../common/adapters/mapper";
import {injectable} from "inversify";
import {PostLikes, PostModel} from "../../../models/schemas/Post.schema";
import {BlogModel, BlogType} from "../domain/blog.entity";


@injectable()
export class QueryBlogsRepository {
    async getBlogs(params: BlogQuery) {
        const {pageNumber, pageSize, sortDirection, sortBy, searchNameTerm} = params
        const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}

        const totalCount: number = await BlogModel.countDocuments(filter)

        const blogs = await BlogModel.find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()

        const mappedBlog: BlogType[] = blogs.map(mapBlogToViewModel)

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: mappedBlog
        }
    }

    async getPosts(userId: string, pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, id: string) {
        const totalCount: number = await PostModel.countDocuments({blogId: id})
        if (!totalCount) return null
        const posts = await PostModel.find({blogId: id})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()
        const postIds = posts.map(post => post._id)
        const userLikes = userId ? await PostLikes.find({postId: {$in: postIds}, userId: userId}).lean() : []
        const allLikes = await PostLikes.find({likeStatus: 'Like'}).sort({addedAt: -1}).lean()
        const post = posts.map(post => {
            const lLikes = allLikes.filter(l => l.postId.toString() === post._id.toString()).slice(0, 3)

            const matchedLikes = userLikes.find(l => l.postId === post._id.toString())
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
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: post
        }
    }

    async getBlog(id: string) {
        if (!ObjectId.isValid(id)) return null
        const blog = await BlogModel.findById(id).lean();
        if (blog) {
            return mapBlogToViewModel(blog)
        }
        return null
    }
}

