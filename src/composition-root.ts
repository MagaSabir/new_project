import {BlogsRepository} from "./modules/blogs/repositories/blog.repository";
import {BlogsService} from "./modules/blogs/services/blog.service";
import {BlogsController} from "./modules/blogs/controllers/blog.controller";
import {AuthRepository} from "./modules/auth/repositories/auth.repository";
import {AuthService} from "./modules/auth/services/auth.service";
import {AuthController} from "./modules/auth/controllers/auth.controller";
import {jwtService} from "./common/adapters/jwt.service";
import {bcryptPasswordHash} from "./common/adapters/bcrypt.password";

const blogsRepository = new BlogsRepository()
const blogsService = new BlogsService(blogsRepository)

export const blogsController = new BlogsController(blogsService)

export const authRepository = new AuthRepository()
const authService = new AuthService(authRepository, jwtService, bcryptPasswordHash)

export const authController = new AuthController(authService)