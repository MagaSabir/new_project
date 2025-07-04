import express, {Request, Response} from "express";
import {blogRouter} from "./modules/blogs/blogs.routes";
import {postRouter} from "./modules/posts/posts.routes";
import {SETTINGS} from "./settings";
import {userRouter} from "./modules/users/users.routes";
import {authRoutes} from "./modules/auth/auth.routes";
import {commentsRoutes} from "./modules/comments/comments.routes";
import cookieParser from 'cookie-parser'
import {devicesRoutes} from "./modules/security/devices.routes";
import {BlogModel} from "./models/schemas/Blog.schema";
import {PostModel} from "./models/schemas/Post.schema";
import {UserModel} from "./models/schemas/User.schema";
import {CommentModel} from "./models/schemas/Comment.schema";
import {AuthModel} from "./models/schemas/Auth.schema";
import {DeviceModel} from "./models/schemas/Device.schema";
import {setupSwagger} from "./swagger/setup-swagger";









export const app = express();
app.set('trust proxy', true)
setupSwagger(app)
app.use(express.json());
app.use(cookieParser())
app.use(SETTINGS.PATH.blogs, blogRouter);
app.use(SETTINGS.PATH.posts, postRouter);
app.use(SETTINGS.PATH.users, userRouter)
app.use(SETTINGS.PATH.auth, authRoutes)
app.use(SETTINGS.PATH.comments, commentsRoutes)
app.use('/security', devicesRoutes)

app.delete("/testing/all-data", async (req: Request, res: Response) => {
    await BlogModel.deleteMany()
    await PostModel.deleteMany()
    await UserModel.deleteMany()

    await CommentModel.deleteMany()
    await DeviceModel.deleteMany()

    await AuthModel.deleteMany()
    res.sendStatus(204);
});







