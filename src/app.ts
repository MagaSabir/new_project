import express, { Request, Response } from "express";
import { blogRouter } from "./routes/blog.routes";
import { postRouter } from "./routes/post.routes";
import { SETTINGS } from "./settings";
import {client, db} from "./db/mongoDb";
import {userRouter} from "./routes/users";
import {authRoutes} from "./routes/auth.routes";

export const app = express();
app.use(express.json());
app.use(SETTINGS.PATH.blogs, blogRouter);
app.use(SETTINGS.PATH.posts, postRouter);
app.use('/users', userRouter)
app.use('/auth/login', authRoutes)


app.use("/testing/all-data", async (req: Request, res: Response) => {
  await db.collection('blogs').deleteMany()
  await db.collection('posts').deleteMany()
  await db.collection('users').deleteMany()
  res.sendStatus(204);
});



