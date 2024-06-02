import { BlogPost } from "./models/BlogPost"
import * as dotenv from "dotenv"
import { DataSource } from "typeorm"
import { User } from "./models/User"
import { Category } from "./models/Category"
import { Comment } from "./models/Comment"
import { Permission } from "./models/Permission"
import { Role } from "./models/Role"
import { Tag } from "./models/Tag"
import { Page } from "./models/Page"
import { Section } from "./models/Section"
import { Content } from "./models/Content"
import { SocialAccount } from "./models/SocialAccount"
import { File } from "./models/File"
import { Menu } from "./models/Menu"
import { Email } from "./models/Email"; // Import Email entity từ tệp tương ứng


dotenv.config()

export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  username: process.env.DB_USERNAME || "root",
  password: process.env.DB_PASSWORD || "123456",
  database: process.env.DB_DATABASE || "news_mvc",
  synchronize: true,
  entities: [
    Category,
    Comment,
    Permission,
    User,
    Role,
    Tag,
    Page,
    BlogPost,
    Section,
    Content,
    SocialAccount,
    File,
    Menu,
    Email
  ],
  subscribers: [],
  migrations: ["src/database/migrations/*.ts"],
  cache: true
});