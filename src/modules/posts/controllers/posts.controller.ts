import {Request, Response} from "express";
import {STATUS_CODE} from "../../../common/utils/http-statuses-code";
import {errorsArray} from "../../../common/utils/errorMessage";
import {ErrorMessageType} from "../../../common/types/blogTypes/blogType";
import {PostViewModel} from "../../../models/post.view.model";
import {postService} from "../services/post.servise";
import {queryPostRepository} from "../queryRepository/query.post.repository";
import {commentRepository} from "../../comments/repositories/comment.repository";
import {commentService} from "../../comments/services/comment.service";


export const postsController = {
  getPosts: async (req: Request, res: Response): Promise<void> => {
    const pageNumber: number = req.query.pageNumber ? +req.query.pageNumber : 1
    const pageSize: number = req.query.pageSize ? +req.query.pageSize : 10
    const sortDirection: 1 | -1 = req.query.sortDirection === 'asc' ? 1 : -1
    const sortBy = req.query.sortBy || 'createdAt'
    const posts = await queryPostRepository.findPosts(pageNumber, pageSize, sortDirection, sortBy)
    res.status(STATUS_CODE.OK_200).send(posts);
  },

  getPostById: async (req: Request, res: Response): Promise<void> => {
    const post: PostViewModel | null = await queryPostRepository.findPost(req.params.id)
    if(!post) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
      return
    }
    res.status(STATUS_CODE.OK_200).send(post)
  },


  createPost: async (req: Request, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req);
    if (errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({errorsMessages: errors});
      return;
    }
      const postId: string | null = await postService.createPostService(req.body);
    if(postId) {
      const post: PostViewModel | null = await queryPostRepository.findPost(postId)
      res.status(STATUS_CODE.CREATED_201).send(post);
    }
  },

  updatePost: async (req: Request, res: Response): Promise<void> => {
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

  deletePost: async (req: Request, res: Response): Promise<void> => {
    const post: boolean = await postService.deletePostService(req.params.id)
    if(!post) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
      return
    }
    res.sendStatus(STATUS_CODE.NO_CONTENT_204)
  },

  createCommentByPostId: async (req: Request, res: Response): Promise<void> => {
    const post = await queryPostRepository.findPost(req.params.id)
    if(!post) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
      return
    }
    // @ts-ignore
    const commentId = await postService.createCommentById(req.body.content, req.user)
    const comment = await queryPostRepository.getCommentById(commentId)
    res.status(200).send(comment)
  }

}