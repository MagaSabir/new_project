import {Request, Response} from "express";
import {STATUS_CODE} from "../core/http-statuses-code";
import {errorsArray} from "../core/utils/errorMessage";
import {PostType} from "../types/postTypse/postType";
import {ErrorMessageType} from "../types/blogTypes/blogType";
import {PostViewModel} from "../models/post.view.model";
import {postService} from "../domain/post.servise";

export const postController = {
  getAllPosts: async (req: Request, res: Response): Promise<void> => {
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10
    const sortDirection: 1 | -1 = req.query.sortDirection === 'asc' ? 1 : -1
    const sortBy = req.query.sortBy || 'createdAt'
    const items: {pagesCount: number,
      page: number,
      pageSize: number,
      totalCount:number,
      items: PostType[]} = await postService.getAllPostsService(pageNumber, pageSize, sortDirection, sortBy)

    res.status(STATUS_CODE.OK_200).send(items);
  },

  getPost: async (req: Request, res: Response): Promise<void> => {
    const post: PostViewModel | null = await postService.getPostService(req.params.id)
    if(!post) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
      return
    }
    res.status(STATUS_CODE.OK_200).send(post)
  },


  postController: async (req: Request, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req);
    if (errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({errorsMessages: errors});
      return;
    }
      const post: PostViewModel | null = await postService.createPostService(req.body);
      res.status(STATUS_CODE.CREATED_201).send(post);
  },

  putController: async (req: Request, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req)
    if(errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({errorsMessages: errors})
      return
    }
    const post: boolean | null = await postService.updatePostService(req.params.id, req.body)
    if(!post) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
      return
    }
    res.sendStatus(STATUS_CODE.NO_CONTENT_204)
  },

  deleteController: async (req: Request, res: Response): Promise<void> => {
    const post: boolean = await postService.deletePostService(req.params.id)
    if(!post) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
      return
    }
    res.sendStatus(STATUS_CODE.NO_CONTENT_204)
  }
}