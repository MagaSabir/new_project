import {Request, Response} from "express";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";
import {PaginationType, ParsedQueryParamsType, RequestWithBody, URIParamsModel} from "../../../common/types/types";
import {BlogViewModel} from "../../../models/BlogViewModel";
import {blogService} from "../services/blog.service";
import {queryBlogRepository} from "../queryRepository/query.blog.repository";
import {queryPostRepository} from "../../posts/queryRepository/query.post.repository";
import {PostViewModel} from "../../../models/post.view.model";
import {sortQueryFields} from "../../../common/types/sortQueryFields";


class BlogsController {
    async getBlogs(req: Request, res: Response) {
        try {
            const query: ParsedQueryParamsType = sortQueryFields(req.query)
            const items: PaginationType<BlogViewModel> = await queryBlogRepository.getBlogs(query)
            return res.status(STATUS_CODE.OK_200).send(items)
        } catch (error) {
            console.log('Get Blogs error:', error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }

    }

    async getPostsByBlogId (req: Request, res: Response) {
        try {
            const blogId: string = req.params.id
            const {pageNumber, pageSize, sortDirection, sortBy} = sortQueryFields(req.query)
            const items: PaginationType<PostViewModel> | false = await queryBlogRepository.getPosts(pageNumber, pageSize, sortDirection, sortBy, blogId)
            if (items) return res.status(STATUS_CODE.OK_200).send(items)
            return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        } catch (error) {
            console.error('Get Posts error:', error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }
    }

    async getBlog (req: Request, res: Response) {
        try {
            const blog: BlogViewModel | null = await queryBlogRepository.getBlog(req.params.id)
            if (!blog) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return res.status(STATUS_CODE.OK_200).send(blog)
        } catch (error) {
            console.error('Get Blog:', error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }

    }

    async createBlog (req: Request, res: Response) {
        try {
            const createdBlogId: string = await blogService.createBlog(req.body)
            const blog: BlogViewModel | null = await queryBlogRepository.getBlog(createdBlogId)
            return res.status(STATUS_CODE.CREATED_201).send(blog)
        } catch (error) {
            console.error('Create Blog error:', error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }
    }

    async updateBlog (req: Request, res: Response) {
        try {
            const isUpdated: boolean = await blogService.updateBlog(req.body, req.params.id)
            if (isUpdated) return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
            return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        } catch (error) {
            console.error('UpdatedBlo error: ', error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }
    }

    async deleteBlog (req: Request, res: Response) {
        try {
            const isDeletedBlog: boolean = await blogService.deleteBlog(req.params.id)
            if (isDeletedBlog) return res.sendStatus(STATUS_CODE.NO_CONTENT_204)
            return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
        } catch (error) {
            console.error('DeletedBlog error: ', error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }

    }

    async createPostByBlogId (req: Request, res: Response) {
        try {
            const createdPostId: string | null = await blogService.createPostByBlogId(req.body, req.params.id)
            if (!createdPostId) return res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            const createdPost: PostViewModel | null = await queryPostRepository.findPost(createdPostId)
            return res.status(STATUS_CODE.CREATED_201).send(createdPost)
        } catch (error) {
            console.error('Create Post:', error)
            return res.sendStatus(STATUS_CODE.SERVER_ERROR)
        }

    }
}

// export const blogController = {
//     getAllBlogs: async (req: Request, res: Response): Promise<void> => {
//         const query = sortQueryFields(req.query)
//         const items = await queryBlogRepository.getBlogs(query)
//         res.status(STATUS_CODE.OK_200).send(items);
//     },
//     getPostsByBlogID: async (req: RequestWithBody<URIParamsModel>, res: Response): Promise<void> => {
//         const id: string = req.params.id
//         const {pageNumber, pageSize, sortDirection, sortBy} = sortQueryFields(req.query);
//         const items = await queryBlogRepository.getPosts(pageNumber, pageSize, sortDirection, sortBy, id)
//         if (items) {
//             res.status(STATUS_CODE.OK_200).send(items)
//         } else {
//             res.sendStatus(STATUS_CODE.NOT_FOUND_404)
//         }
//     },
//     getBlog: async (req: RequestWithBody<URIParamsModel>, res: Response): Promise<void> => {
//
//         const blog: BlogViewModel | null = await queryBlogRepository.getBlog(req.params.id);
//         if (!blog) {
//             res.sendStatus(STATUS_CODE.NOT_FOUND_404);
//             return;
//         }
//         res.status(STATUS_CODE.OK_200).send(blog)
//     },
//     createBlog: async (req: Request, res: Response): Promise<void> => {
//         const id: string = await blogService.createBlog(req.body)
//         const blog: BlogViewModel | null = await queryBlogRepository.getBlog(id)
//         res.status(STATUS_CODE.CREATED_201).send(blog);
//     },
//     updateBlog: async (req: Request, res: Response): Promise<void> => {
//         const result: boolean | null = await blogService.updateBlog(req.body, req.params.id);
//         if (!result) {
//             res.sendStatus(STATUS_CODE.NOT_FOUND_404);
//             return
//         }
//         res.sendStatus(STATUS_CODE.NO_CONTENT_204)
//     },
//
//     deleteBlog: async (req: Request, res: Response): Promise<void> => {
//         const blog: boolean = await blogService.deleteBlog(req.params.id);
//         if (!blog) {
//             res.sendStatus(STATUS_CODE.NOT_FOUND_404);
//             return;
//         }
//         res.sendStatus(STATUS_CODE.NO_CONTENT_204);
//     },
//
//     createPostByBlogId: async (req: Request, res: Response): Promise<void> => {
//         const id: string | null = await blogService.createPostByBlogId(req.body, req.params.id)
//         if (!id) {
//             res.sendStatus(STATUS_CODE.NOT_FOUND_404)
//         } else {
//             const post: PostViewModel | null = await queryPostRepository.findPost(id)
//             res.status(STATUS_CODE.CREATED_201).send(post)
//         }
//     }
// };

export const blogsController = new BlogsController()

