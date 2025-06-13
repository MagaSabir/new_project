import {BlogType, DataReqBodyType} from "../../../common/types/blogTypes/blogType";
import {BlogViewModel} from "../../../models/BlogViewModel";
import {BlogsRepository} from "../repositories/blog.repository";
import {InsertOneResult} from "mongodb";
import {DataReqBodyPostType, PostType} from "../../../common/types/postTypse/postType";
import {postRepository} from "../../posts/repositories/post.repository";
import {injectable} from "inversify";
import {QueryBlogsRepository} from "../queryRepository/query.blog.repository";

@injectable()
export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository,
                protected queryBlogRepository: QueryBlogsRepository) {}

    async createBlog(reqBody: DataReqBodyType): Promise<string> {
        const newBlog = {
            ...reqBody,
            createdAt: new Date().toISOString(),
            isMembership: false
        }
        const result: InsertOneResult<BlogType> = await this.blogsRepository.createBlog(newBlog)
        return result.insertedId.toString()

    }

    async updateBlog(reqBody: BlogType, id: string) {
        return await this.blogsRepository.updateBlog(reqBody, id)
    }

    async deleteBlog(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlog(id)
    }

    async createPostByBlogId(reqBody: DataReqBodyPostType, blogId: string): Promise<string | null> {
        const blog: BlogViewModel | null = await this.queryBlogRepository.getBlog(blogId)
        if (!blog) return null
        const newPost = {
            ...reqBody,
            blogId: blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        const result: InsertOneResult<PostType> = await postRepository.createPost(newPost)
        return result.insertedId.toString()
    }
}