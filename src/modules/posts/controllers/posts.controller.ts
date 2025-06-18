import {Request, Response} from "express";
import {STATUS_CODE} from "../../../common/adapters/http-statuses-code";
import {PostViewModel} from "../../../models/view_models/post.view.model";
import {QueryPostRepository} from "../queryRepository/query.post.repository";
import {QueryRepoComment} from "../../comments/queryRepositories/query.repo.comment";
import {PaginationType} from "../../../common/types/types";
import {sortQueryFields} from "../../../common/types/sortQueryFields";
import {PostsService} from "../services/post.servise";
import {injectable} from "inversify";

@injectable()
export class PostsController {
    constructor(
        protected postService: PostsService,
        protected queryPostRepository: QueryPostRepository,
        protected queryCommentRepository: QueryRepoComment) {
    }

    async getPosts(req: Request, res: Response): Promise<void> {
        const {pageNumber, pageSize, sortDirection, sortBy} = sortQueryFields(req.params)
        const posts: PaginationType<PostViewModel> = await this.queryPostRepository.findPosts(pageNumber, pageSize, sortDirection, sortBy)
        res.status(STATUS_CODE.OK_200).send(posts);
    }

    async getPostById(req: Request, res: Response): Promise<void> {
        const post: PostViewModel | null = await this.queryPostRepository.getPost(req.params.id)
        if (!post) {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }
        res.status(STATUS_CODE.OK_200).send(post)
    }


    async createPost(req: Request, res: Response): Promise<void> {
        const postId: string | null = await this.postService.createPostService(req.body);
        console.log(postId)
        if (postId) {
            const post: PostViewModel | null = await this.queryPostRepository.getPost(postId)
            res.status(STATUS_CODE.CREATED_201).send(post);
            return
        }

    }

    async updatePost(req: Request, res: Response): Promise<void> {
        const post: boolean | null = await this.postService.updatePostService(req.params.id, req.body)
        if (!post) {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }

    async deletePost(req: Request, res: Response): Promise<void> {
        const post: boolean = await this.postService.deletePostService(req.params.id)
        if (!post) {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }
        res.sendStatus(STATUS_CODE.NO_CONTENT_204)
    }

    async createCommentByPostId(req: Request, res: Response): Promise<void> {
        const post: PostViewModel | null = await this.queryPostRepository.getPost(req.params.id)
        try {
            if (!post) {
                res.sendStatus(STATUS_CODE.NOT_FOUND_404)
                return
            }

            const commentId: string = await this.postService.createCommentById(req.body.content, req.user, req.params.id)
            const comment = await this.queryCommentRepository.getCommentById(commentId)
            res.status(201).send(comment)
        } catch (e) {
            console.error('error : ->', e)
        }
    }

    async getComments(req: Request, res: Response) {
        const postId: string = req.params.id
        const {pageNumber, pageSize, sortDirection, sortBy} = sortQueryFields(req.params)

        const comment = await this.queryCommentRepository.getComments(postId, pageNumber, pageSize, sortDirection, sortBy)
        if (!comment.items.length) {
            res.sendStatus(STATUS_CODE.NOT_FOUND_404)
            return
        }
        res.status(STATUS_CODE.OK_200).send(comment)
        return
    }

}