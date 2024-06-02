import express from "express";
import { HomeController } from "../controllers/homeController";
import { UserController } from "../controllers/userController";
import { BlogPostController } from "../controllers/blogPostController";
import { ImageController } from "../controllers/imageController";
import { CommentController } from "../controllers/commentController";
let router = express.Router();

const initWebRoute = (app) => {
  router.get("/", HomeController.getHomePage);
  router.get("/login", HomeController.getHomePage);
  router.post("/login", UserController.login);
  router.get("/register", HomeController.getRegisterPage);
  router.post("/register", UserController.register);
  // router.get("/verify", loginController.verify);
  // router.post("/create-slide", homeController.createSlide);


  // router.get("/user/get-user", UserController.getUser);
  // router.post("/user/create-user", UserController.createUser);
  // router.get("/user/edit-add-user", UserController.getViewEditUser);
  // router.post("/user/update-user", UserController.updateUser);
  // router.get("/user/delete-user", UserController.deleteUser);
  // router.get("/dashboard", HomeController.getDashboard);
  router.post("/blog-post", BlogPostController.getPosts)
  router.delete("/blog-post/:id", BlogPostController.deletePost)
  router.get("/blog-post/form", BlogPostController.formPosts)
  router.get("/blog-post/form/:id", BlogPostController.formPosts)
  router.post("/blog-post/add-new", BlogPostController.createPost)
  router.put("/blog-post/update/:id", BlogPostController.updatePost)
  router.get("/comment", CommentController.getComments)
  router.delete("/comment/:id", CommentController.deleteComment)
  router.patch("/comment/:id", CommentController.hideComment)
  router.post("/file", ImageController.uploadFile)
  return app.use("/", router);
};

export default initWebRoute;
