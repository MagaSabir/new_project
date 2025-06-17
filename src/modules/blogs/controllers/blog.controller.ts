import {Request, Response} from "express";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";
import {PaginationType, ParsedQueryParamsType} from "../../../common/types/types";
import {BlogsService} from "../services/blog.service";
import { QueryBlogsRepository} from "../queryRepository/query.blog.repository";
import {PostViewModel} from "../../../models/view_models/post.view.model";
import {sortQueryFields} from "../../../common/types/sortQueryFields";
import {injectable} from "inversify";
import {BlogType, BlogViewModel} from "../../../models/schemas/Blog.schema";
import {QueryPostRepository} from "../../posts/queryRepository/query.post.repository";

@injectable()
export class BlogsController {
    constructor(protected blogsService: BlogsService,
                protected queryBlogRepository: QueryBlogsRepository,
                protected queryPostRepository: QueryPostRepository) {}

    async getBlogs(req: Request, res: Response) {
        try {
            const query: ParsedQueryParamsType = sortQueryFields(req.query)
            const items: PaginationType<BlogType> = await this.queryBlogRepository.getBlogs(query)
            res.status(STATUS_CODE.OK_200).send(items)
        } catch (error) {
            console.error('Get Blogs error:', error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }

    }

    async getPostsByBlogId(req: Request, res: Response) {
        try {
            const blogId: string = req.params.id
            const {pageNumber, pageSize, sortDirection, sortBy} = sortQueryFields(req.query)
            const items: PaginationType<PostViewModel> | null = await this.queryBlogRepository.getPosts(pageNumber, pageSize, sortDirection, sortBy, blogId)
            if (items) {
                res.status(STATUS_CODE.OK_200).send(items)
                return
            }
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        } catch (error) {
            console.error('Get Posts error:', error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }
    }

    async getBlog(req: Request, res: Response) {
        try {
            const blog: BlogViewModel | null = await this.queryBlogRepository.getBlog(req.params.id)
            if (!blog) {
                res.sendStatus(STATUS_CODE.NOT_FOUND_404)
                return
            }
            res.status(STATUS_CODE.OK_200).send(blog)
        } catch (error) {
            console.error('Get Blog:', error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }

    }

    async createBlog(req: Request, res: Response) {
        try {
            const createdBlogId: string = await this.blogsService.createBlog(req.body)
            const blog: BlogViewModel | null = await this.queryBlogRepository.getBlog(createdBlogId)
            res.status(STATUS_CODE.CREATED_201).send(blog)
        } catch (error) {
            console.error('Create Blog error:', error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }
    }

    async updateBlog(req: Request, res: Response) {
        try {
            const isUpdated: boolean = await this.blogsService.updateBlog(req.body, req.params.id)
            if (isUpdated) {
                res.sendStatus(STATUS_CODE.NO_CONTENT_204)
                return
            }
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        } catch (error) {
            console.error('UpdatedBlo error: ', error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }
    }

    async deleteBlog(req: Request, res: Response) {
        try {
            const isDeletedBlog: boolean = await this.blogsService.deleteBlog(req.params.id)
            if (isDeletedBlog) {
                res.sendStatus(STATUS_CODE.NO_CONTENT_204)
                return
            }
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        } catch (error) {
            console.error('DeletedBlog error: ', error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }

    }

    async createPostByBlogId(req: Request, res: Response) {
        try {
            const createdPostId: string | null = await this.blogsService.createPostByBlogId(req.body, req.params.id)
            if (!createdPostId) {
                res.sendStatus(STATUS_CODE.NOT_FOUND_404)
                return
            }
            const createdPost: PostViewModel | null = await this.queryPostRepository.getPost(createdPostId)
            res.status(STATUS_CODE.CREATED_201).send(createdPost)
        } catch (error) {
            console.error('Create Post:', error)
            res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }

    }
}


