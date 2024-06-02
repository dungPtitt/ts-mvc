import { AppDataSource } from "../database/data-source"
import { User } from "../database/models/User";
import bcrypt from 'bcrypt';
let salt = bcrypt.genSaltSync(10);
import jwt from "jsonwebtoken";
import { Role } from "../database/models/Role";
import { Permission } from "../database/models/Permission";
// import emailService from "./emailService";
import logger from "../loggers/mylog";

export class UserService {
  static handleLogin = (data, password) => {
    return new Promise(async (resolve, reject) => {
      try {
        const repo = AppDataSource.getRepository(User);

        let acc = await repo.createQueryBuilder("user")
          .where("user.email = :email", { email: data })
          .getOne()
        if (!acc) {
          acc = await repo.createQueryBuilder("user")
            .where("user.username = :username", { username: data })
            .getOne()
        }
        if (!acc) {
          return resolve({
            code: 404,
            errMessage: "User not exist in db!"
          })
        }
        let check = await bcrypt.compare(password, acc.password);
        if (!check) {
          return resolve({
            code: 2,
            errMessage: "Wrong password!"
          })
        }
        const payload = {
          user: {
            id: acc.id,
            username: acc.username,
          },
        }
        const accessToken = jwt.sign(payload, process.env.ACCESS_KEY_SECRET || "secretAdmin", { expiresIn: "1d" })
        const refreshToken = jwt.sign({ userId: acc.id }, process.env.REFRESH_KEY_SECRET || "refreshSecretAdmin", { expiresIn: "1d" });
        const resLogin = {
          user: {
            id: acc.id,
            email: acc.email,
            username: acc.username,
            accessToken,
            refreshToken,
          },
        };
        resolve({
          code: 200,
          message: "Login successfully!",
          data: resLogin
        });
      } catch (e) {
        reject(e)
      }
    })
  }

  // static handleRegister = (data) => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       if(!data || !data.username || !data.email || !data.password || !data.confirmPassword) {
  //         return resolve({
  //           code: 404,
  //           errMessage: "Missing input value!"
  //         })
  //       }
  //       if(data.password != data.confirmPassword) {
  //         return resolve({
  //           code: 400,
  //           errMessage: "Don't match password and confirm password!"
  //         })
  //       }
  //       const userRepository = AppDataSource.getRepository(User);
  //       const roleRepository = AppDataSource.getRepository(Role);
  //       const user = await AppDataSource.getRepository(User)
  //       .createQueryBuilder("user")
  //       .where("user.username = :username AND user.email = :email", { username: data.username, email: data.email })
  //       .getRawOne()
  //       if(user){
  //         return resolve({
  //           errCode: 400, 
  //           errMessage: "Name and email of user đã có trong database.Vui lòng thư lại!"
  //         })
  //       }

  //       // Tạo mới vai trò 'admin' nếu nó chưa tồn tại
  //       let adminRole = await roleRepository.findOne({ where: { name: "admin" } });
  //       if (!adminRole) {
  //         adminRole = await roleRepository.save({ name: "admin" });
  //       }

  //       // Tạo một người dùng mới với vai trò 'admin'
  //       const passwordHash = await this.hashUserPassword(data.password);
  //       let userNew = new User();
  //       userNew.username = data.username;
  //       userNew.email = data.email;
  //       userNew.password = data.passwordHash;
  //       // await userRepository.save(new User({
  //       //   username: data.username,
  //       //   email: data.email,
  //       //   password: passwordHash,
  //       //   roles: [adminRole],
  //       // }));

  //       resolve({
  //         code: 200,
  //         message: "Create User successfully!",
  //       });
  //     } catch (e) {
  //       reject(e)
  //     }
  //   })
  // }

  static verifyToken = (token) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!token) {
          return resolve({
            errCode: 403,
            errMessage: "Missing token"
          })
        }
        let result = await jwt.verify(token, process.env.ACCESS_KEY_SECRET || "secretAdmin");
        if (result) {
          const acc = await AppDataSource.getRepository(User)
            .createQueryBuilder("user")
            .where("user.email = :email", { email: result.user.email })
            .getOne()
          return resolve({
            errCode: 200,
            data: {},
            errMessage: "Login Successfully!"
          })
        }
        return resolve({
          errCode: 403,
          errMessage: "Invalid Token"
        })
      } catch (e) {
        reject(e);
      }
    });
  }

  static checkIsAdmin = (userId) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await AppDataSource.getRepository(User)
          .createQueryBuilder("user")
          .where("user.id = :id", { id: userId })
          .getOne()
        if (!user) {
          return resolve({
            errCode: 1,
            errMessage: "User not found!"
          })
        }
        // if(user.idAuth!==3){
        //   return resolve({
        //     errCode: 2,
        //     errMessage: "Require Admin Role!"
        //   })
        // }
        return resolve({
          errCode: 0,
          message: "Welcome admin"
        })
      } catch (e) {
        reject(e);
      }
    })
  }
  // static handleChangePassword = (data) => {
  //   return new Promise(async (resolve, reject) => {
  //     try {
  //       let userId = data.userId,
  //           password = data.password,
  //           newpassword = data.newpassword;
  //       if(!userId || !password|| !newpassword){
  //         resolve({
  //           errCode: 1,
  //           errMessage: "Missing input value!"
  //         })
  //       }
  //       let acc = await db.User.findOne({
  //         where: { id: userId },
  //         raw: false
  //       })
  //       if(!acc){
  //         resolve({
  //           errCode: 2,
  //           errMessage: "User not exist in db!"
  //         })
  //       }
  //       let check = await bcrypt.compare(password, acc.password);
  //       if(!check){
  //         return resolve({
  //           errCode: 2,
  //           errMessage: "Wrong password!"
  //         })
  //       }
  //       acc.password =  await this.hashUserPassword(newpassword);
  //       await acc.save();
  //       resolve({
  //         errCode: 0,
  //         message: "Change password successfully!",
  //       });
  //     } catch (e) {
  //       reject(e)
  //     }
  //   })
  // }

  static handleForgotPassword = (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        let name = data.name;
        let email = data.email;
        if (!name || !email) {
          resolve({
            errCode: 1,
            errMessage: "Missing input value!"
          })
        }
        const acc = await AppDataSource.getRepository(User)
          .createQueryBuilder("user")
          .where("user.name = :name AND user.email = :email", { name: name, email: email })
          .getRawOne()
        if (!acc) {
          resolve({
            errCode: 2,
            errMessage: "User not exist in db!"
          })
        }
        let password = Math.random().toString().substr(2, 6);
        data.password = password;
        let hashPasswordFromBcrypt = await this.hashUserPassword(password);
        acc.password = hashPasswordFromBcrypt;
        await acc.save();
        resolve({
          errCode: 0,
          message: "Get password successfully!",
        });
      } catch (e) {
        reject(e)
      }
    })
  }

  static handleGetUser = (idUser)=>{
    return new Promise(async(resolve, reject)=>{
      try{
        if(!idUser){
        const users = await AppDataSource.getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect('user.roles', 'roles')
        .getMany()

          return resolve({
            errCode: 0,
            message: "Get all User successfully!",
            data: users
          })
        }
        let user:any = await AppDataSource.getRepository(User)
        .createQueryBuilder("user")
        .leftJoinAndSelect('user.roles', 'roles')
        .where("user.id = :id", { id: idUser})
        .getOne()
        if(!user){
          return resolve({
            errCode: 2,
            message: "User not exist",
          })
        }
        const listRole = await AppDataSource.getRepository(Role)
            .createQueryBuilder("role")
            .getMany()
        let roles:any = [];
        for(let i=0; i<listRole.length; i++) {
          let check=true;
          for(let j=0; j<user.roles.length; j++) {
            if(listRole[i].id == user.roles[j].id) {
              roles.push(listRole[i]);
              check=false;
              break;
            }
          }
          if(check) roles.push({});
        }
        user.roles = roles;
        user.allRoles = listRole;
        return resolve({
          errCode: 0,
          message: "Get User successfully!",
          data: user
        })
      } catch (e) {
        reject(e);
      }
    })
  }

  static handleCreateUser = async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!data.username || !data.email || !data.password) {
          return resolve({
            errCode: 1,
            errMessage: "Missing input value!"
          })
        }
        const user = await AppDataSource.getRepository(User)
          .createQueryBuilder("user")
          .where("user.username = :username AND user.email = :email", { username: data.username, email: data.email })
          .getRawOne()
        if (user) {
          return resolve({
            errCode: 2,
            errMessage: "Name and email of user đã có trong database.Vui lòng thư lại!"
          })
        }
        let passwordHash: any = await this.hashUserPassword(data.password);
        const userNew = await AppDataSource.getRepository(User)
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(
            { username: data.username, email: data.email, password: passwordHash }
        )
        .execute()

        const userId = userNew.raw.insertId;
        for(let i=0; i<data.roles.length; i++) {
          await AppDataSource.getRepository(Role).query(`INSERT INTO user_role(usersId, rolesId) value(${Number(userId)}, ${Number(data.roles[i])})`);
        }
        resolve({
          errCode: 0,
          message: "Create User successfully!",
        });
      } catch (e) {
        reject(e)
      }
    })
  }

  static hashUserPassword = (password) => {
    return new Promise(async (resolve, reject) => {
      try {
        let hashPassword = bcrypt.hashSync(password, salt);
        resolve(hashPassword)
      } catch (e) {
        reject(e)
      }
    })
  }

  static handleUpdateUser = async (data) => {
    try {
      const userUpdate = await AppDataSource
      .createQueryBuilder()
      .update(User)
      .set({ username: data.username, email: data.email })
      .where("id = :id", { id: Number(data.id) })
      .execute()
      if(userUpdate.affected==0) {
        return {
          code: 404,
          errMessage: "User not found!"
        }
      }
      // console.log("data", data);
      await AppDataSource.getRepository(Role).query(`DELETE FROM user_role WHERE usersId=${Number(data.id)}`);
      for(let i=0; i<data.roles.length; i++) {
        // console.log("ida", data.roles[i]);
        await AppDataSource.getRepository(Role).query(`INSERT INTO user_role(usersId, rolesId) value(${Number(data.id)}, ${Number(data.roles[i])})`);
      }
      return {
        code: 200,
        message: "Update user success"
      }
    }catch(err: any) {
        // console.log("err:::", err.message)
        console.log("err", err);
        return {
          code: 500,
          errMessage: "Error from server" 
        }
    }
  }

  static handleDeleteUser = async (userId)=>{
    try{
      const userDeleted = await AppDataSource.createQueryBuilder()
      .delete()
      .from(User)
      .where("id = :id", { id: userId })
      .execute()
      if(userDeleted.affected==0) {
        return {
          code: 404,
          errMessage: "User not found!" 
        }
      }
      return {
        code: 200,
        message: "Delete user success"
      }
    } catch (err: any) {
      console.log("err:::", err.message)
      return {
        code: 500,
        message: "error form server"
      }
    }
  }

  //------------Role user-------------------------
  static handleGetRoleUser = (roleId) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!roleId) {
          const roles = await AppDataSource.getRepository(Role)
            .createQueryBuilder("role")
            .getMany()
          return resolve({
            errCode: 200,
            message: "Get all role successfully!",
            data: roles
          })
        }
        const role = await AppDataSource.getRepository(Role)
          .createQueryBuilder("role")
          .where("role.id = :id", { id: roleId })
          .getOne()
        if (!role) {
          return resolve({
            errCode: 404,
            message: "Role not exist",
          })
        }
        return resolve({
          errCode: 200,
          message: "Get role successfully!",
          data: role
        })
      } catch (e) {
        reject(e);
      }
    })
  }
  static handleCreateRoleUser = async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        if (!data.name) {
          return resolve({
            errCode: 404,
            errMessage: "Missing input value!"
          })
        }
        const role = await AppDataSource.getRepository(Role)
          .createQueryBuilder("role")
          .where("role.name = :name", { name: data.name })
          .getRawOne()
        if (role) {
          return resolve({
            errCode: 400,
            errMessage: "Role đã có trong database.Vui lòng thư lại!"
          })
        }
        await AppDataSource.getRepository(User)
          .createQueryBuilder()
          .insert()
          .into(Role)
          .values(
            { name: data.name }
          )
          .execute()
        resolve({
          errCode: 200,
          message: "Create role successfully!",
        });
      } catch (e) {
        reject(e)
      }
    })
  }
  static handleUpdateRoleUser = async (data) => {
    try {
      if (!data.name || !data.id) {
        return {
          errCode: 404,
          errMessage: "Missing input value!"
        }
      }
      // const userUpdate = await AppDataSource
      // .createQueryBuilder()
      // .update(Role)
      // .set({ name: data.name })
      // .where("id = :id", { id: data.id })
      // .execute()
      const userUpdate: any = undefined
      if (userUpdate.affected == 0) {
        return {
          code: 404,
          errMessage: "Role not found!"
        }
      }
      return {
        code: 200,
        message: "Update user success"
      }
    }catch(err: any) {
        logger.error(err.message);
    }
  }
  static handleRoleUser = async (roleId)=>{
    try{
      const roleDeleted = await AppDataSource.createQueryBuilder()
      .delete()
      .from(Role)
      .where("id = :id", { id: roleId })
      .execute()
      if(roleDeleted.affected==0) {
        return {
          code: 404,
          errMessage: "Role not found!" 
        }
      }
      return {
        code: 200,
        message: "Delete role success"
      }
    }catch(err: any) {
      console.log("err:::", err.message)
      return {
        code: 500,
        message: "error form server"
      }
    }
  }

  //----permission

  static async handleGetPermissionRole() {
    try {
      const repo = AppDataSource.getRepository(Role)
      const roles = await repo.createQueryBuilder('roles')
        .leftJoinAndSelect("roles.permissions", "permissions")
        .getMany()
      const permissions = await AppDataSource.getRepository(Permission)
        .createQueryBuilder('permissions')
        .leftJoinAndSelect('permissions.roles', 'roles')
        .getMany()

      permissions.map((item: any, index) => {
        let all_role: any = [];
        for (let i = 0; i < roles.length; i++) {
          let check = true;
          for (let j = 0; j < item.roles.length; j++) {
            if (roles[i].id == item.roles[j].id) {
              all_role.push(item.roles[j])
              check = false;
              break;
            }
          }
          if (check) all_role.push({})
        }
        item.roles = all_role;
        return item;
      })
      return {
        code: 200,
        message: "Update user success",
        data: { roles, permissions }
      }
    } catch (err) {
      return {
        code: 500,
        errMessage: "Error from server"
      }
    }
  }

  static handleUpdatePermissionRole = async (data) => {
    try {
      const arr = Object.keys(data).map(key => key);
      console.log(arr); // Output: [1, 2, 3]
      await AppDataSource.getRepository(Permission).query('DELETE FROM role_permission');
      for (let i = 0; i < arr.length; i++) {
        let [roleId, permissionId] = arr[i].split(',');
        // console.log("roleId", roleId, permissionId);
        await AppDataSource.getRepository(Permission).query(`insert into role_permission (rolesId, permissionsId) values (${roleId},${permissionId})`)
      }
      return {
        code: 200,
        message: "Update user success"
      }
    } catch (err: any) {
      console.log("err:::", err.message)
    }
  }
}