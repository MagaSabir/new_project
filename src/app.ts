import express, { Request, Response } from "express";
import { blogRouter } from "./routes/blog.routes";
import { postRouter } from "./routes/post.routes";
import { db } from "./db/db.blogs";
import { SETTINGS } from "./settings";

export const app = express();
app.use(express.json());

app.use(SETTINGS.PATH.blogs, blogRouter);
app.use(SETTINGS.PATH.posts, postRouter);

app.use("/testing/all-data", (req: Request, res: Response) => {
  db.posts = [];
  db.blogs = [];
  res.sendStatus(204);
});


