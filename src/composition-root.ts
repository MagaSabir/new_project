import "reflect-metadata"
import {BlogsRepository} from "./modules/blogs/repositories/blog.repository";
import {BlogsService} from "./modules/blogs/services/blog.service";
import {BlogsController} from "./modules/blogs/controllers/blog.controller";
import {AuthRepository} from "./modules/auth/repositories/auth.repository";
import {AuthService} from "./modules/auth/services/auth.service";
import {AuthController} from "./modules/auth/controllers/auth.controller";
import {Container} from "inversify";
import {QueryBlogsRepository} from "./modules/blogs/queryRepository/query.blog.repository";
import {PostsController} from "./modules/posts/controllers/posts.controller";
import {PostsService} from "./modules/posts/services/post.servise";
import {PostRepository} from "./modules/posts/repositories/post.repository";
import {QueryPostRepository} from "./modules/posts/queryRepository/query.post.repository";
import {UsersController} from "./modules/users/controllers/users.controller";
import {UserService} from "./modules/users/services/users.service";
import {UsersRepository} from "./modules/users/repositories/users.repository";
import {QueryUsersRepository} from "./modules/users/queryRepository/query.users.repository";
import {QueryRepoComment} from "./modules/comments/queryRepositories/query.repo.comment";
import {CommentController} from "./modules/comments/controllers/comment.controller";
import {CommentRepository} from "./modules/comments/repositories/comment.repository";
import {CommentService} from "./modules/comments/services/comment.service";


export const container = new Container()
//Blogs
container.bind(BlogsController).to(BlogsController)
container.bind(BlogsService).to(BlogsService)
container.bind(BlogsRepository).to(BlogsRepository)
container.bind(QueryBlogsRepository).to(QueryBlogsRepository)
//Auth
container.bind(AuthRepository).to(AuthRepository)
container.bind(AuthService).to(AuthService)
container.bind(AuthController).to(AuthController)
//Posts
container.bind(PostsController).to(PostsController)
container.bind(PostsService).to(PostsService)
container.bind(QueryRepoComment).to(QueryRepoComment)
container.bind(QueryPostRepository).to(QueryPostRepository)
container.bind(PostRepository).to(PostRepository)
//Users
container.bind(UsersController).to(UsersController)
container.bind(UserService).to(UserService)
container.bind(UsersRepository).to(UsersRepository)
container.bind(QueryUsersRepository).to(QueryUsersRepository)
//Comments
container.bind(CommentController).to(CommentController)
container.bind(CommentRepository).to(CommentRepository)
container.bind(CommentService).to(CommentService)
