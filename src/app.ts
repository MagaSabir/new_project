import express, { Request, Response } from "express";
import { blogRouter } from "./routes/blogs.routes";
import { postRouter } from "./routes/posts.routes";
import { SETTINGS } from "./settings";
import { db} from "./db/mongoDb";
import {userRouter} from "./routes/users.routes";
import {authRoutes} from "./routes/auth.routes";
import {setupSwagger} from "./setup-swagger";

export const app = express();
setupSwagger(app)
app.use(express.json());
app.use(SETTINGS.PATH.blogs, blogRouter);
app.use(SETTINGS.PATH.posts, postRouter);
app.use(SETTINGS.PATH.users, userRouter)
app.use(SETTINGS.PATH.auth, authRoutes)


app.use("/testing/all-data", async (req: Request, res: Response) => {
  await db.collection('blogs').deleteMany()
  await db.collection('posts').deleteMany()
  await db.collection('users').deleteMany()
  res.sendStatus(204);
});



