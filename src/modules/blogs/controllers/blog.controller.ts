import {Request, Response} from "express";
import {STATUS_CODE} from "../../../common/utils/http-statuses-code";
import {errorsArray} from "../../../common/utils/errorMessage";
import {ErrorMessageType} from "../../../common/types/blogTypes/blogType";
import {RequestWithBody, URIParamsModel} from "../../../common/types/types";
import {BlogViewModel} from "../../../models/BlogViewModel";
import {blogService} from "../services/blog.servise";
import {queryBlogRepository} from "../queryRepository/query.blog.repository";
import {queryPostRepository} from "../../posts/queryRepository/query.post.repository";
import {PostViewModel} from "../../../models/post.view.model";

export  const  blogController = {
  getAllBlogs: async (req: Request, res: Response): Promise<void> => {
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10
    const sortDirection: 1 | -1 = req.query.sortDirection === 'asc' ? 1 : -1
    const searchNameTerm = req.query.searchNameTerm
    const sortBy = req.query.sortBy || 'createdAt'
    const items = await queryBlogRepository.findBlogs(pageNumber, pageSize, sortDirection, sortBy as string, searchNameTerm as string)
    res.status(STATUS_CODE.OK_200).send(items);
  },


  getPostsByBlogID: async (req: RequestWithBody<URIParamsModel>, res: Response): Promise<void> => {
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10
    const sortDirection: 1 | -1 = req.query.sortDirection === 'asc' ? 1 : -1
    const sortBy: string | any = req.query.sortBy || 'createdAt'
    const id: string = req.params.id

    const errors: ErrorMessageType[]= errorsArray(req)
    if(errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: errors })
    }
    const items = await queryBlogRepository.findPosts(pageNumber, pageSize, sortDirection, sortBy, id)
    if(items) {
      res.status(STATUS_CODE.OK_200).send(items)
    } else {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
  },

  getBlog: async (req: RequestWithBody<URIParamsModel>, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req)
    if(errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: errors })
    }
    const blog: BlogViewModel | null =  await  queryBlogRepository.findBlog(req.params.id);
    if (!blog) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404);
      return;
    }
    res.status(STATUS_CODE.OK_200).send(blog)
  },

  postController: async (req: Request, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req);
    if (errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: errors });
      return;
    }

    const id: string = await blogService.createBlogService(req.body)
    const blog: BlogViewModel | null = await queryBlogRepository.findBlog(id)
    res.status(STATUS_CODE.CREATED_201).send(blog);
  },

  putController: async (req: Request, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req);
    if (errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: errors });
      return;
    }
    const result: boolean | null = await blogService.putBlogService(req.body, req.params.id);
    if(!result) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404);
      return
    }
    res.sendStatus(STATUS_CODE.NO_CONTENT_204)
  },

  deleteController: async (req: Request, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req)
    if(errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: errors })
    }
    const blog: boolean = await blogService.deleteBlogService(req.params.id);
    if (!blog) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404);
      return;
    }
    res.sendStatus(STATUS_CODE.NO_CONTENT_204);
  },

  postControllerByBlogId: async (req: Request, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req)
    if (errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: errors })
      return
    }
    const id: string | null = await blogService.createPostByBlogIdService(req.body, req.params.id)
    if(!id) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    } else {
      const post: PostViewModel | null = await queryPostRepository.findPost(id)
      res.status(STATUS_CODE.CREATED_201).send(post)
    }
  }
};



