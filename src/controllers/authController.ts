import { NextFunction, Request, Response } from "express"
import { AppDataSource } from "../database/data-source"
import { AuthService } from "../services/AuthService"
import { Role } from "../database/models/Role"
import { Permission } from "../database/models/Permission"

export class AuthController {
  static async addRole(req: Request, res: Response) {
    const role = req.body
    try {
      const repo = AppDataSource.getRepository(Role)
      const newRole = repo.create(role)
      const data = await repo.save(newRole)
      return res.status(200).json({ message: 'Add new role successful', data: data })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }
  static async setRole(req: Request, res: Response) {
    const { userId, roleId } = req.body
    try {
      const data = await AuthService.setRole(userId, roleId)
      return res.status(200).json({ message: 'Set role successful', data: data })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }
  static async setRolePermission(req: Request, res: Response) {
    const { permissions, roleId } = req.body
    try {
      for (let item of permissions) {
        const repo = AppDataSource.getRepository(Permission)
        const check = await repo.findOneByOrFail({ name: item })
        if (!check) return res.status(404).json({ message: `${item} is not a permission` })
        await repo.query(`insert into role_permission (rolesId, permissionsId) values (${roleId},${check.id})`)
      }
      return res.status(200).json({ message: 'Set permission successful', data: { ...permissions, roleId } })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }
  static async getAllPermission(req: Request, res: Response) {
    try {
      const data = await AuthService.getAllPermissions()
      return res.status(200).json({ message: "Fetch permissions successful", permissions: data })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ message: error })
    }
  }
}