import { Request, Response } from "express";
import { STATUS_CODE } from "../core/http-statuses-code";
import { errorsArray } from "../core/utils/errorMessage";
import { blogRepository } from "../repositories/blog.repository";
import { postRepository } from "../repositories/post.repository";
import { PostType } from "../types/postTypse/postType";
import {BlogType, ErrorMessageType} from "../types/blogTypes/blogType";
import {WithId} from "mongodb";
import {PostViewModel} from "../models/post.view.model";

export const postController = {
  getAllPosts: async (req: Request, res: Response): Promise<void> => {
    const dbPosts: WithId<PostType>[] = await postRepository.findPosts();
    const posts: PostViewModel[] = dbPosts.map((el: WithId<PostType>): PostViewModel => {
      return {
        id: el._id.toString(),
        title: el.title,
        shortDescription: el.shortDescription,
        content: el.content,
        blogId: el.blogId,
        blogName: el.blogName,
        createdAt: el.createdAt
      }
    })
    res.status(STATUS_CODE.OK_200).send(posts);
  },

  getPost: async (req: Request, res: Response): Promise<void> => {
    const dbPost: WithId<PostType> | null = await postRepository.findPost(req.params.id)
    if(!dbPost) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
      return
    }
    res.json({
      id: dbPost._id.toString(),
      title: dbPost.title,
      shortDescription: dbPost.shortDescription,
      content: dbPost.content,
      blogId: dbPost.blogId,
      blogName: dbPost.blogName,
      createdAt: dbPost.createdAt
    })
  },


  postController: async (req: Request, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req);
    if (errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({errorsMessages: errors});
      return;
    }
    const blog: WithId<BlogType> | null = await blogRepository.findBlog(req.body.blogId);
    if(blog) {
      const newPost = {
        title: req.body.title,
        shortDescription: req.body.shortDescription,
        content: req.body.content,
        blogId: req.body.blogId,
        blogName: blog.name,
        createdAt: new Date().toISOString()
      };
      const post: PostType = await postRepository.createPost(newPost);
      res.status(STATUS_CODE.CREATED_201).send(post);
    }
  },

  putController: async (req: Request, res: Response): Promise<void> => {
    const errors: ErrorMessageType[] = errorsArray(req)
    if(errors.length) {
      res.status(STATUS_CODE.BAD_REQUEST_400).send({errorsMessages: errors})
      return
    }
    const post: boolean = await postRepository.updatePost(req.params.id, req.body)
    if(!post) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
      return
    }
    res.sendStatus(STATUS_CODE.NO_CONTENT_204)
  },

  deleteController: async (req: Request, res: Response): Promise<void> => {
    const post: boolean = await postRepository.deletePost(req.params.id)
    if(!post) {
      res.sendStatus(STATUS_CODE.NOT_FOUND_404)
      return
    }
    res.sendStatus(STATUS_CODE.NO_CONTENT_204)
  }
}