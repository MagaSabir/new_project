import {BlogsRepository} from "../repositories/blog.repository";
import {PostDto} from "../../../common/types/postTypse/postType";
import {PostRepository} from "../../posts/repositories/post.repository";
import {injectable} from "inversify";
import {QueryBlogsRepository} from "../queryRepository/query.blog.repository";
import {BlogModel} from "../../../models/schemas/Blog.schema";
import {BlogType} from "../../../common/types/blogTypes/blogType";
import {PostModel} from "../../../models/schemas/Post.schema";

@injectable()
export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository,
                protected queryBlogRepository: QueryBlogsRepository,
                protected postRepository: PostRepository) {
    }

    async createBlog(dto: BlogType): Promise<string> {
        const blog = new BlogModel(dto)
        return await this.blogsRepository.save(blog)
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