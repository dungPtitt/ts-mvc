import express from "express";
import { HomeController } from "../controllers/homeController";
import { UserController } from "../controllers/userController";
import { BlogPostController } from "../controllers/blogPostController";
import { CategoryController } from "../controllers/categoryController";
import { AuthMiddleware } from "../middlewares/authJwt";
import { PermissionType } from "../constants/Role";
import { LoggerController } from "../controllers/loggerController";

let router = express.Router();

const initAdminRoute = (app) => {

  router.get("/logout", UserController.logout);
  router.get("/dashboard", HomeController.getDashboard);
  router.get("/blog-post", BlogPostController.getPosts);

  //Manage user
  router.get("/user/get-user", 
  // AuthMiddleware.authorize(PermissionType.USER_VIEW),
  UserController.getUser);
  router.post("/user/create-user", UserController.createUser);
  router.get("/user/edit-add-user", UserController.getViewEditUser);
  router.post("/user/update-user", UserController.updateUser);
  router.get("/user/delete-user", UserController.deleteUser);

  //Manage role of user
  router.get("/user/get-role", UserController.getRoleUser);
  router.post("/user/create-role", UserController.createRoleUser);
  router.get("/user/edit-add-role", UserController.getViewEditRoleUser);
  router.post("/user/update-role", UserController.updateRoleUser);
  router.get("/user/delete-role", UserController.deleteRoleUser);

  router.get("/user/get-permission-role", UserController.getPermissionRole);
  router.post("/user/update-permission-role", UserController.updatePermissionRole);
  //Manage category of blog
  router.get("/category/get", CategoryController.getCategory);
  router.post("/category/create", CategoryController.createCategory);
  router.get("/category/edit-add-category", CategoryController.getViewEditCategory);
  router.post("/category/update", CategoryController.updateCategory);
  router.get("/user/delete", CategoryController.deleteCategory);

  //logger
  router.get("/logger", LoggerController.getAllFileInFolderLog);
  router.post("/blog-post/filter", BlogPostController.getPosts)
  return app.use("/", AuthMiddleware.checkLogin, router);
};

export default initAdminRoute;
