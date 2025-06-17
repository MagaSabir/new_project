import {ObjectId, WithId} from "mongodb";
import {PostViewModel} from "../../../models/view_models/post.view.model";
import {mapPostToViewModel} from "../../../common/adapters/mapper";
import {PostDocument, PostModel, PostType} from "../../../models/schemas/Post.schema";

export class QueryPostRepository  {
    async findPosts(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: any)  {
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
            items: mappedPost
        }
    }

    async getPost(id: string): Promise<PostViewModel | null> {
        const post =  await PostModel.findById(id).lean()
        if(post) {
            return mapPostToViewModel(post)
        }
        return null
    }
}