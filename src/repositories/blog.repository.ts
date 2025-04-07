import {db} from "../db/db.blogs";
import {BlogType} from "../types/blogTypes/blogType";

export const blogRepository = {
    findBlogs(): BlogType[] {
        return db.blogs
    },

    findBlog(id: string):BlogType | undefined {
        return db.blogs.find((el: BlogType) => el.id === id)
    },

    createBlog(newBlog: BlogType) {
     return db.blogs.push(newBlog)
    },

    updateBlog(newBlog: BlogType, id: string) {
        const blog: BlogType | undefined = db.blogs.find((el: BlogType): boolean => el.id === id)
        if(!blog) {
            return null
        }
        blog.name = newBlog.name,
        blog.description = newBlog.description,
        blog.websiteUrl = newBlog.websiteUrl
        return
    },

    deleteBlog(id: string) {
        const index =  db.blogs.findIndex((el) => el.id === id)

        if(index === -1) {
            return null
        }
        db.blogs.splice(index, 1)

    }
}