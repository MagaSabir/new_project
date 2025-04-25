import { config } from "dotenv";

config();

export const SETTINGS = {
  PORT: process.env.PORT || 3000,
  PATH: {
    blogs: "/blogs",
    posts: "/posts",
    cleanDB: "/testing/all-data",
    users: "/users",
    auth: "/auth/login"
  },
  DB_NAME: 'blogPlatform',
  ADMIN_AUTH: "admin:qwerty",
};
