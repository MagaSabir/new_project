import express, {Request, Response} from "express";
import {blogRouter} from "./routes/blog.routes";
import {postRouter} from "./routes/post.routes";

export const app = express()
app.use(express.json())

app.use('/', blogRouter)
app.use('/api', blogRouter)

app.use('/', postRouter)


app.use('/', (req:Request, res:Response) => {
    res.status(200).json({
        'version': '1.0.0'
    })
})
