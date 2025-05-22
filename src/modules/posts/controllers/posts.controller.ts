import {Request, Response} from "express";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";
import {PostViewModel} from "../../../models/post.view.model";
import {postService} from "../services/post.servise";
import {queryPostRepository} from "../queryRepository/query.post.repository";
import {queryRepoComment} from "../../comments/queryRepositories/query.repo.comment";
import {PaginationType} from "../../../common/types/types";
import {sortQueryFields} from "../../../common/types/sortQueryFields";


export const postsController = {
  getPosts: async (req: Request, res: Response): Promise<void> => {
    const { pageNumber, pageSize, sortDirection, sortBy } = sortQueryFields(req.params)
    const posts: PaginationType<PostViewModel> = await queryPostRepository.findPosts(pageNumber, pageSize, sortDirection, sortBy)
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
      const postId: string | null = await postService.createPostService(req.body);

    if(postId) {
      const post: PostViewModel | null = await queryPostRepository.findPost(postId)
      res.status(STATUS_CODE.CREATED_201).send(post);
      return
    }

  },

  updatePost: async (req: Request, res: Response): Promise<void> => {
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
    const post: PostViewModel | null = await queryPostRepository.findPost(req.params.id)
   try {
     if(!post) {
       res.sendStatus(STATUS_CODE.NOT_FOUND_404)
       return
     }

     const commentId: string = await postService.createCommentById(req.body.content, req.user, req.params.id)
     const comment = await queryRepoComment.getCommentById(commentId)
     res.status(201).send(comment)
   } catch (e) {
     console.error('error : ->', e)
   }
  },

  getComments: async(req: Request, res: Response) => {
    const postId:string = req.params.id
    const {pageNumber, pageSize, sortDirection, sortBy} = sortQueryFields(req.params)

    const comment = await queryRepoComment.getComments(postId, pageNumber, pageSize, sortDirection, sortBy)
    if(!comment.items.length){
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
      return
    }
    res.status(STATUS_CODE.OK_200).send(comment)
    return
  }

}