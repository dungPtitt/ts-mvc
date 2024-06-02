import { AppDataSource } from "../database/data-source";
import { NextFunction } from "express";
import jwt from "jsonwebtoken";
import { UserService } from "../services/userService";
import { User } from "../database/models/User";

export class AuthMiddleware {
  static verifyToken = (req, res, next) => {
    let token = req.headers["x-access-token"];

    if (!token) {
      return res.status(200).json({
        errCode: 1,
        errMessage: "No token provided!"
      });
    }

    jwt.verify(token, "mk", (err, decoded) => {
      if (err) {
        return res.status(200).json({
          errCode: 1,
          errMessage: "Unauthorized!"
        });
      }
      console.log(decoded);
      req.userId = decoded.id;
      next();
    });
  };

  static isAdmin = async(req, res, next) => {
    try{
      let response: any = await UserService.checkIsAdmin(req.userId);
      if(response.errCode===0){
        next();
        return;
      }
      return res.status(200).json(response);
    }catch(e){
      return res.status(500).send({
        errCode: -1,
        errMessage: "Err from server!"
      });
    }
  };

  static checkLogin = async(req, res, next)=>{
    try{
      let token = req.cookies.token;
      let id;
      if(token){
        jwt.verify(token, process.env.ACCESS_KEY_SECRET || "secretAdmin", (err, decoded) => {
          if (err) {
            // return res.render("handleError.ejs", {errMessage: "Unauthorized"})
            return res.redirect("/login")
          }
          id = decoded.user.id
        })
        // @ts-ignore
        const repo = AppDataSource.getRepository(User);
        const user = await repo.findOneByOrFail({ id });
        req.user = user;
        return next();
      }
      return res.redirect("/login");
    }catch(err: any) {
      console.log("err", err.message)
      return res.status(500).json({
        errCode: -1,
        errMessage: "Err from server!"
      })
    }
  }
  static authorize(action: string) {
    return async (req, res, next: NextFunction) => {
      try{
        let permissions = []
        // @ts-ignore
        const user = req.user as User;
        if (!user) {
          return res.render("handleError.ejs", {errMessage: "Unauthorized - Permission not allowed"})
        }
        const repo = AppDataSource.getRepository(User);
        const fetchData = await repo.query(`SELECT DISTINCT permissions.name FROM users INNER JOIN user_role ON users.id = user_role.usersId INNER JOIN roles ON user_role.rolesId = roles.id INNER JOIN role_permission ON roles.id = role_permission.rolesId INNER JOIN permissions on role_permission.permissionsId = permissions.id WHERE users.id = ${user.id}`)
        for (let ob of fetchData) {
          //@ts-ignore
          permissions.push(ob.name)
        }
        // console.log("permissions", permissions)
        //@ts-ignore
        req.permissions = permissions;
        //@ts-ignore
        if (permissions.includes(action))
          next()
        else return res.render("handleError.ejs", {errMessage: "Unauthorized - Permission not allowed"})
      }catch(e) {
        return res.status(500).json({
        errCode: -1,
          errMessage: "Err from server!"
        })
      }
    }
  }
}