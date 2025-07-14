import {BlogsRepository} from "../infrasctructure/blog.repository";
import {PostDto} from "../../../common/types/postTypse/postType";
import {PostRepository} from "../../posts/infrastructure/post.repository";
import {injectable} from "inversify";
import {QueryBlogsRepository} from "../infrasctructure/query.blog.repository";
import {CrateBlogDto, UpdateBlogDto} from "../domain/blog.dto";
import {BlogDocument, BlogModel} from "../domain/blog.entity";
import {PostModel} from "../../posts/domain/post.entity";

@injectable()
export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository,
                protected queryBlogRepository: QueryBlogsRepository,
                protected postRepository: PostRepository) {
    }

    async createBlog(dto: CrateBlogDto): Promise<string> {
        const blog: BlogDocument = BlogModel.createBlog(dto)
        return await this.blogsRepository.save(blog)
    }

    async updateBlog(dto: UpdateBlogDto, id: string) {
        const blog: BlogDocument | null = await this.blogsRepository.findBlogById(id)
        if (!blog) return null
        blog.updateBlog(dto)
        return !!await this.blogsRepository.save(blog)
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
        return await this.postRepository.save(post)
    }
}