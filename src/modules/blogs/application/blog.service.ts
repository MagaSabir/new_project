import {BlogsRepository} from "../infrasctructure/blog.repository";
import {PostDto} from "../../../common/types/postTypse/postType";
import {PostRepository} from "../../posts/repositories/post.repository";
import {injectable} from "inversify";
import {QueryBlogsRepository} from "../infrasctructure/query.blog.repository";
import {PostModel} from "../../../models/schemas/Post.schema";
import {CrateBlogDto} from "../domain/blog.dto";
import {BlogModel, BlogType} from "../domain/blog.entity";

@injectable()
export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository,
                protected queryBlogRepository: QueryBlogsRepository,
                protected postRepository: PostRepository) {
    }

    async createBlog(dto: CrateBlogDto): Promise<string> {
        const blog = await BlogModel.createBlog(dto)
        return (await this.blogsRepository.save(blog)).toString()
    }

    async updateBlog(dto: BlogType, id: string) {
        return await this.blogsRepository.updateBlog(dto, id)
    }

    async deleteBlog(id: string): Promise<boolean> {
        return await this.blogsRepository.deleteBlog(id)
    }

    async createPostByBlogId(dto: PostDto, blogId: string): Promise<string | null> {
        const blog = await this.queryBlogRepository.getBlog(blogId)
        if (!blog) return null
        const newPost = {
            ...dto,
            blogId: blogId,
            blogName: blog.name,
            createdAt: new Date().toISOString()
        }
        const post = new PostModel(newPost)
        return  await this.postRepository.save(post)
    }
}