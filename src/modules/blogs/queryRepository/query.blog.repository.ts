import {ObjectId, WithId} from "mongodb";
import {BlogQuery, BlogType} from "../../../common/types/blogTypes/blogType";
import {blogCollection, postCollection} from "../../../db/mongoDb";
import {mapBlogToViewModel, mapPostToViewModel} from "../../../common/adapters/mapper";
import {BlogViewModel} from "../../../models/BlogViewModel";
import {PostType} from "../../../common/types/postTypse/postType";
import {PostViewModel} from "../../../models/post.view.model";
import {PaginationType} from "../../../common/types/types";

class QueryBlogsRepository {
    async getBlogs(params: BlogQuery): Promise<PaginationType<BlogViewModel>> {
        const {pageNumber, pageSize, sortDirection, sortBy, searchNameTerm} = params
        const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options: 'i'}} : {}

        const totalCount: number = await blogCollection.countDocuments(filter)

        const blogs: WithId<BlogType>[] = await blogCollection.find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        const mappedBlog: BlogViewModel[] = blogs.map(mapBlogToViewModel)

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: mappedBlog
        }
    }

    async getPosts(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, id: string): Promise<PaginationType<PostViewModel> | null> {
        const totalCount: number = await postCollection.countDocuments({blogId: id})
        if (!totalCount) return null
        const posts: WithId<PostType>[] = await postCollection.find({blogId: id})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        const mappedPost: PostViewModel[] = posts.map(mapPostToViewModel)

        return {
            pagesCount: Math.ceil(totalCount / pageSize),
            page: pageNumber,
            pageSize,
            totalCount,
            items: mappedPost
        }
    }

    async getBlog(id: string): Promise<BlogViewModel | null> {
        if(!ObjectId.isValid(id)) return null
        const blog: WithId<BlogType> | null = await blogCollection.findOne({_id: new ObjectId(id)});
        if (blog) return mapBlogToViewModel(blog)
        return null
    }
}

export const queryBlogRepository = new QueryBlogsRepository()