import { AuthService } from "../services/AuthService";
import { UserService } from "../services/userService";
// import logger from "../loggers/winston.log";
import logger from "../loggers/mylog";
export class UserController {

  //
  static login = async(req, res)=>{
    try{
      let data = req.body;
      let response:any = await UserService.handleLogin(data.info, data.password);
      if(response.code==200){
        res.cookie("token", response.data.user.accessToken, {
          maxAge: 86400*60// thoi gian song sau 60 phut;
        });
        return res.redirect("/dashboard");
      }
      return res.redirect("/login");
    }catch(e){
      console.log(e);
      return res.status(500).json({
        errCode: -1,
        errMessage: "Err from server!"
      })
    }
  }

  static register = async(req, res)=>{
    try{
      let data = req.body;
      console.log(data);
      // let response:any = await UserService.handleRegister(data);
      // if(response.code==200){
      //   return res.redirect("/login");
      // }
      return res.redirect("/register");
    }catch(e){
      console.log(e);
      return res.status(500).json({
        errCode: -1,
        errMessage: "Err from server!"
      })
    }
  }

  static logout = async(req, res) => {
    try{
      let token = req.cookies.token;
      res.cookie("token", "");
      return res.redirect("/login");
    }catch(err: any) {
      console.log("err", err.message)
      return res.status(500).json({
        errCode: -1,
        errMessage: "Err from server!"
      })
    }
  }
  static verify = async(req, res)=>{
    try{
      let token = req.cookies.token;
      let response:any = await UserService.verifyToken(token);
      if(response.errCode==200){
        //set idAuth vao cookie
        res.cookie("idRole", response.data.idAuth, {
          maxAge: 86400*60// thoi gian song sau 60 phut;
        });
        return res.redirect("/dashboard");
        // switch (response.data.idAuth) {
        //   case 1:
            
        //   case 2:
        //     return res.redirect("/manager");
        //   case 3:
        //     return res.redirect("/member");
        //   default:
        //     return res.redirect("/login");
        // }
      }else{
        return res.redirect("/login");
      }
    }catch(e){
      console.log(e);
      return res.status(500).json({
        errCode: -1,
        errMessage: "Error from server!"
      })
    }
  }

  static createUser = async (req, res) => {
    try {
      let data = req.body;
      let response: any = await UserService.handleCreateUser(data);
      if (response.errCode == 0) {
        return res.redirect("/user/get-user");
      }
      return res.render("errPage", { errMessage: response.errMessage });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        errCode: -1,
        errMessage: "Err from server!"
      })
    }
  }

  static getUser = async (req, res) => {
    try {
      let idUser = req.query.id;
      let response: any = await UserService.handleGetUser(idUser);
      return res.render("user/listUser.ejs", { data: response.data });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        errCode: -1,
        errMessage: "Error from server!"
      })
    }
  }

  static getViewEditUser = async (req, res) => {
    try {
      let idUser = req.query.id;
      let data: any = {
        username: "",
        email: "",
        password: "",
      }
      if (idUser != -1) {
        let response: any = await UserService.handleGetUser(idUser);
        data = response.data;
      }else {
        let allRoles:any = await UserService.handleGetRoleUser(null);
        data.allRoles = allRoles.data;
      }
      return res.render("user/EditAddUser.ejs", { data: data, idUser: idUser });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        errCode: -1,
        errMessage: "Error from server!"
      })
    }
  }

  static updateUser = async (req, res) => {
    try {
      let data = req.body;
      let response: any = await UserService.handleUpdateUser(data);
      if (response.code == 200) {
        return res.redirect("/user/get-user");
      }
      return res.render("errPage", { errMessage: response.errMessage });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        errCode: -1,
        errMessage: "Error from server!"
      })
    }
  }
  static deleteUser = async(req, res)=>{
    try{
      let idUser = req.query.id;
      let response: any = await UserService.handleDeleteUser(idUser);
      if(response.code==200){
        return res.redirect("/user/get-user");
      }
      return res.render("errPage", { errMessage: response.errMessage });
    }catch(e){
      console.log(e);
      res.status(500).json({
        errCode: -1,
        errMessage: "Err from server!"
      })
    }
  }

  //-------------role-----------------------------
  static createRoleUser = async (req, res) => {
    try {
      let data = req.body;
      let response: any = await UserService.handleCreateRoleUser(data);
      if (response.errCode == 200) {
        return res.redirect("/user/get-role");
      }
      return res.render("errPage", { errMessage: response.errMessage });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        errCode: 500,
        errMessage: "Err from server!"
      })
    }
  }

  static getRoleUser = async (req, res) => {
    try {
      let roleId = req.query.id;
      let response: any = await UserService.handleGetRoleUser(roleId);
      // CustomLog.error(`${"madad"}`, req);
      return res.render("user/listRole.ejs", { data: response.data });
    } catch (e:any) {
      logger.error(e.message);
      res.status(500).json({
        errCode: -1,
        errMessage: "Error from server!"
      })
    }
  }

  static getViewEditRoleUser = async (req, res) => {
    try {
      let roleId = req.query.id;
      let data = {
        name: "",
      }
      if (roleId != -1) {
        let response: any = await UserService.handleGetRoleUser(roleId);
        data = response.data;
      }
      return res.render("user/EditAddRoleUser.ejs", { data: data, roleId: roleId });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errCode: -1,
        errMessage: "Error from server!"
      })
    }
  }

  static updateRoleUser = async (req, res) => {
    try {
      let data = req.body;
      let response: any = await UserService.handleUpdateRoleUser(data);
      if (response.code == 200) {
        return res.redirect("/user/get-role");
      }
      return res.render("errPage", { errMessage: response.errMessage });
    } catch (e:any) {
      logger.error(`${req.url}::${req.method}::${e.message}`)
      res.render("errPage", { errMessage: e.message });
    }
  }
  static deleteRoleUser = async(req, res)=>{
    try{
      let roleId = req.query.id;
      let response: any = await UserService.handleRoleUser(roleId);
      if(response.code==200){
        return res.redirect("/user/get-role");
      }
      return res.render("errPage", { errMessage: response.errMessage });
    }catch(e: any){
      console.log(e);
      res.render("errPage", { errMessage: e.message });
    }
  }

  //-----------------Permission
  static getPermissionRole = async (req, res) => {
    try {
      let response: any = await UserService.handleGetPermissionRole();
      console.log("permissions", response.data.permissions);
      return res.render("user/listPermission.ejs", { roles: response.data.roles, permissions: response.data.permissions });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errCode: -1,
        errMessage: "Error from server!"
      })
    }
  }

  static updatePermissionRole = async(req, res)=> {
    try {
      let data = req.body;
      console.log("data", data)
      // const response = {
      //   code: 200,
      //   errMessage: "mmm"
      // }
      let response: any = await UserService.handleUpdatePermissionRole(data);
      if (response.code == 200) {
        return res.redirect("/user/get-role");
      }
      return res.render("errPage", { errMessage: response.errMessage });
    } catch (e:any) {
      console.log(e);
      res.render("errPage", { errMessage: e.message });
    }
  }
}
