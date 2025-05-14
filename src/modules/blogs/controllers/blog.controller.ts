import {Request, Response} from "express";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";
import {RequestWithBody, URIParamsModel} from "../../../common/types/types";
import {BlogViewModel} from "../../../models/BlogViewModel";
import {blogService} from "../services/blog.servise";
import {queryBlogRepository} from "../queryRepository/query.blog.repository";
import {queryPostRepository} from "../../posts/queryRepository/query.post.repository";
import {PostViewModel} from "../../../models/post.view.model";
import {sortQueryFields} from "../../../common/types/sortQueryFields";

export  const  blogController = {
  getAllBlogs: async (req: Request, res: Response): Promise<void> => {
    const query = sortQueryFields(req.query)
    const items = await queryBlogRepository.getBlogs(query)
    res.status(STATUS_CODE.OK_200).send(items);
  },


  getPostsByBlogID: async (req: RequestWithBody<URIParamsModel>, res: Response): Promise<void> => {
    const id: string = req.params.id
    const { pageNumber, pageSize, sortDirection, sortBy} = sortQueryFields(req.query);
    const items = await queryBlogRepository.getPosts(pageNumber, pageSize, sortDirection, sortBy, id)
    if(items) {
      res.status(STATUS_CODE.OK_200).send(items)
    } else {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    }
  },

  getBlog: async (req: RequestWithBody<URIParamsModel>, res: Response): Promise<void> => {

    const blog: BlogViewModel | null =  await  queryBlogRepository.getBlog(req.params.id);
    if (!blog) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404);
      return;
    }
    res.status(STATUS_CODE.OK_200).send(blog)
  },

  createBlog: async (req: Request, res: Response): Promise<void> => {
    const id: string = await blogService.createBlogService(req.body)
    const blog: BlogViewModel | null = await queryBlogRepository.getBlog(id)
    res.status(STATUS_CODE.CREATED_201).send(blog);
  },

  updateBlog: async (req: Request, res: Response): Promise<void> => {
    const result: boolean | null = await blogService.putBlogService(req.body, req.params.id);
    if(!result) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404);
      return
    }
    res.sendStatus(STATUS_CODE.NO_CONTENT_204)
  },

  deleteBlog: async (req: Request, res: Response): Promise<void> => {
    const blog: boolean = await blogService.deleteBlogService(req.params.id);
    if (!blog) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404);
      return;
    }
    res.sendStatus(STATUS_CODE.NO_CONTENT_204);
  },

  createPostByBlogId: async (req: Request, res: Response): Promise<void> => {
    const id: string | null = await blogService.createPostByBlogIdService(req.body, req.params.id)
    if(!id) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
    } else {
      const post: PostViewModel | null = await queryPostRepository.findPost(id)
      res.status(STATUS_CODE.CREATED_201).send(post)
    }
  }
};



