import express, { Request, Response } from "express";
import { blogRouter } from "./routes/blog.routes";
import { postRouter } from "./routes/post.routes";
import { SETTINGS } from "./settings";
import {client} from "./db/mongoDb";
import {userRouter} from "./routes/users";

export const app = express();
app.use(express.json());
app.use("/users", userRouter)
app.use(SETTINGS.PATH.blogs, blogRouter);
app.use(SETTINGS.PATH.posts, postRouter);


app.use("/testing/all-data", async (req: Request, res: Response) => {
  await client.db('blogPlatform').collection('blogs').deleteMany()
  await client.db('blogPlatform').collection('posts').deleteMany()
  res.sendStatus(204);
});



