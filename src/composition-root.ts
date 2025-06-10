import {BlogsRepository} from "./modules/blogs/repositories/blog.repository";
import {BlogsService} from "./modules/blogs/services/blog.service";
import {BlogsController} from "./modules/blogs/controllers/blog.controller";

const blogsRepository = new BlogsRepository()
const blogsService = new BlogsService(blogsRepository)

export const blogsController = new BlogsController(blogsService)