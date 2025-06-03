import express, { Request, Response } from "express";
import { blogRouter } from "./modules/blogs/blogs.routes";
import { postRouter } from "./modules/posts/posts.routes";
import { SETTINGS } from "./settings";
import { db} from "./db/mongoDb";
import {userRouter} from "./modules/users/users.routes";
import {authRoutes} from "./modules/auth/auth.routes";
import {setupSwagger} from "./swagger/setup-swagger";
import {commentsRoutes} from "./modules/comments/comments.routes";
import cookieParser from 'cookie-parser'
import {devicesRoutes} from "./modules/security/devices.routes";

export const app = express();
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
  await db.collection('blogs').deleteMany()
  await db.collection('posts').deleteMany()
  await db.collection('users').deleteMany()
  await db.collection('comments').deleteMany()
  res.sendStatus(204);
});




