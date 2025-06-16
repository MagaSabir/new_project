import {ObjectId, WithId} from "mongodb";
import {BlogQuery, BlogType} from "../../../common/types/blogTypes/blogType";
import {mapBlogToViewModel, mapPostToViewModel} from "../../../common/adapters/mapper";
import {PostType} from "../../../common/types/postTypse/postType";
import {PostViewModel} from "../../../models/view_models/post.view.model";
import {PaginationType} from "../../../common/types/types";
import {injectable} from "inversify";
import {BlogModel} from "../../../models/schemas/User.schema";


@injectable()
export class QueryBlogsRepository {
    async getBlogs(params: BlogQuery) {
        const {pageNumber, pageSize, sortDirection, sortBy, searchNameTerm} = params
        const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}

        const totalCount: number = await BlogModel.countDocuments(filter)

        const blogs: WithId<BlogType>[] = await BlogModel.find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()

        const mappedBlog = blogs.map(mapBlogToViewModel)

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: mappedBlog
        }
    }

    async getPosts(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, id: string): Promise<PaginationType<PostViewModel> | null> {
        const totalCount: number = await PostModel.countDocuments({blogId: id})
        if (!totalCount) return null
        const posts: WithId<PostType>[] = await PostModel.find({blogId: id})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .lean()

        const mappedPost: PostViewModel[] = posts.map(mapPostToViewModel)

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: mappedPost
        }
    }

    async getBlog(id: string) {
        if (!ObjectId.isValid(id)) return null
        const blog: WithId<BlogType> | null = await BlogModel.findById({_id: (id)});
        if (blog) return mapBlogToViewModel(blog)
        return null
    }
}

