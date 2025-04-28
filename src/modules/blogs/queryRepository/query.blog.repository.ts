import {ObjectId, WithId} from "mongodb";
import {BlogType} from "../../../common/types/blogTypes/blogType";
import {blogCollection, client, postCollection} from "../../../db/mongoDb";
import {mapper} from "../../../common/utils/mapper";
import {BlogViewModel} from "../../../models/BlogViewModel";
import {PostType} from "../../../common/types/postTypse/postType";
import {PostViewModel} from "../../../models/post.view.model";

export const queryBlogRepository = {
    async findBlogs(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, searchNameTerm: string) {
        const filter = searchNameTerm ? {name: {$regex: searchNameTerm, $options:'i'}} : {}

        const totalCountBlogs: number = await blogCollection.countDocuments(filter)

        const blog: WithId<BlogType>[] =  await client.db('blogPlatform').collection<BlogType>('blogs').find(filter)
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()

        const blogs: BlogViewModel[] = blog.map((el: WithId<BlogType>): BlogViewModel => {
            return mapper(el)
        })

        return {
            pagesCount: Math.ceil(totalCountBlogs / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount:totalCountBlogs,
            items: blogs
        }
    },

    async findPosts(pageNumber: number, pageSize: number, sortDirection: 1 | -1, sortBy: string, id: string) {
        const totalCountPosts: number = await postCollection.countDocuments({blogId: id})
        if(!totalCountPosts) return false
        const posts: WithId<PostType>[] = await postCollection.find({blogId: id})
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize)
            .sort({[sortBy]: sortDirection})
            .toArray()


        const newPosts: PostViewModel[] = posts.map((el:WithId<PostType>): PostViewModel => {
            return {
                id: el._id.toString(),
                title: el.title,
                shortDescription: el.shortDescription,
                content: el.content,
                blogId: el.blogId,
                blogName: el.blogName,
                createdAt: el.createdAt
            }
        })
        return {
            pagesCount: Math.ceil(totalCountPosts / pageSize),
            page: pageNumber,
            pageSize: pageSize,
            totalCount:totalCountPosts,
            items: newPosts
        }
    },

    async findBlog(id: string): Promise<BlogViewModel | null>{
        const dbBlog: WithId<BlogType> | null = await blogCollection.findOne({_id: new ObjectId(id)});
        if(dbBlog) {
            return {
                id: dbBlog._id.toString(),
                name: dbBlog.name,
                description: dbBlog.description,
                websiteUrl: dbBlog.websiteUrl,
                createdAt: dbBlog.createdAt,
                isMembership: dbBlog.isMembership
            }
        } return null
    },


}