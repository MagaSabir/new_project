import {Request, Response} from "express";
import {STATUS_CODE} from "../core/http-statuses-code";
import {errorsArray} from "../core/utils/errorMessage";
import {ErrorMessageType} from "../types/blogTypes/blogType";
import {RequestWithBody, URIParamsModel} from "../types";
import {BlogViewModel} from "../models/BlogViewModel";
import {blogService} from "../domain/blog.servise";
import {PostViewModel} from "../models/post.view.model";

export  const  blogController =   {
  getAllBlogs: async (req: Request, res: Response): Promise<void>  => {
    const pageNumber = req.query.pageNumber ? +req.query.pageNumber : 1
    const pageSize = req.query.pageSize ? +req.query.pageSize : 10
    const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1
    const searchNameTerm = req.query.searchNameTerm
    const sortBy = req.query.sortBy || 'createdAt'
    const items = await blogService.getBlogsService(pageNumber, pageSize, sortDirection, sortBy, searchNameTerm)
    res.status(STATUS_CODE.OK_200).send(items);
  },


  getPostsByBlogID: async (req: Request, res: Response): Promise<void> => {
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10
    const sortDirection = req.query.sortDirection === 'asc' ? 1 : -1
    const sortBy = req.query.sortBy || 'createdAt'
    const id = req.params.id
    const items = await blogService.getPostsService(pageNumber, pageSize, sortDirection, sortBy, id)
    if(items) res.status(STATUS_CODE.OK_200).send(items)
    res.sendStatus(STATUS_CODE.NOT_FOUND_404)
  },

  getBlog: async (req: RequestWithBody<URIParamsModel>, res: Response): Promise<void> => {
    const blog: BlogViewModel | null =  await  blogService.getBlogService(req.params.id);
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

    const body = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl
    }
    const blog: BlogViewModel = await blogService.createBlogService(body)
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

    const post: PostViewModel | null = await blogService.createPostByBlogIdService(req.body, req.params.id)
    if(!post) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
    res.status(STATUS_CODE.CREATED_201).send(post)
  }
};



