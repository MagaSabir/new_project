import { Request, Response } from "express";
import { STATUS_CODE } from "../core/http-statuses-code";
import { errorsArray } from "../core/utils/errorMessage";
import {blogRepository} from "../repositories/blog.repository";
import {BlogType, ErrorMessageType} from "../types/blogTypes/blogType";

import {RequestWithBody, URIParamsModel} from "../types";
import {BlogViewModel} from "../models/BlogViewModel";
import {WithId} from "mongodb";

export  const  blogController =   {
  getAllBlogs: async (req: Request, res: Response): Promise<void>  => {
    const dbBlogs:WithId<BlogType>[] = await blogRepository.findBlogs();
    const blogs: BlogViewModel[] = dbBlogs.map((el: WithId<BlogType>): BlogViewModel => {
      return {
        id: el._id.toString(),
        name: el.name,
        description: el.description,
        websiteUrl: el.websiteUrl
      }
    })
    res.status(STATUS_CODE.OK_200).send(blogs);
  },

  getBlogById: async (req: RequestWithBody<URIParamsModel>, res: Response): Promise<void> => {
    const dbBlog: WithId<BlogType> | null =  await  blogRepository.findBlog(req.params.id);
    if (!dbBlog) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404);
      return;
    }
    res.status(STATUS_CODE.OK_200).json({
      id: dbBlog._id.toString(),
      name: dbBlog.name,
      description: dbBlog.description,
      websiteUrl: dbBlog.websiteUrl
    });
  },

  postController: async (req: Request, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req);
    if (errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: errors });
      return;
    }
    const newBlog = {
      name: req.body.name,
      description: req.body.description,
      websiteUrl: req.body.websiteUrl,
    };
    const blog: BlogViewModel = await blogRepository.createBlog(newBlog);
    res.status(STATUS_CODE.CREATED_201).send(blog);
  },

  putController: async (req: Request, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req);
    if (errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({ errorsMessages: errors });
      return;
    }
    const result: Boolean = await blogRepository.updateBlog(req.body, req.params.id);
    if(!result) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404);
      return
    }
    res.sendStatus(STATUS_CODE.NO_CONTENT_204)
  },

  deleteController: async (req: Request, res: Response): Promise<void> => {
    const blog = await blogRepository.deleteBlog(req.params.id);
    if (!blog) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404);
      return;
    }
    res.sendStatus(STATUS_CODE.NO_CONTENT_204);
  },
};


