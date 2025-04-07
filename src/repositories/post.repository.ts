import {db} from "../db/db.blogs";
import {PostType} from "../types/postTypse/postType";

export const postRepository = {
    findPosts(): PostType[] {
        return db.posts
    },

    findPost(id: string):PostType | undefined {
        return db.posts.find((el: PostType): boolean => el.id === id)
    },

    createPost(newPost: PostType) {
        return db.posts.push(newPost)
    },

    updatePost(newPost: PostType, id: string) {
        const post: PostType | undefined = db.posts.find((el: PostType): boolean => el.id === id)
        if(!post) {
            return null
        }
        post.title = newPost.title,
        post.shortDescription = newPost.shortDescription,
        post.content = newPost.content
        post.blogId = newPost.blogId
        return
    },

    deletePost(id: string) {
        const index =  db.posts.findIndex((el) => el.id === id)

        if(index === -1) {
            return null
        }
        db.posts.splice(index, 1)

    }
}