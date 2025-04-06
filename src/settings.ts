import {config} from "dotenv";

config()

export const SETTINGS = {
    PORT: process.env.PORT || 3000,
    PATH: {
        blogs: "/blogs",
        posts: '/posts',
        cleanDB: "/testing/all-data"
    },
    ADMIN_AUTH: 'admin:qwerty'
}

