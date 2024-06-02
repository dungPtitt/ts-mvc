
import { AppDataSource } from "../database/data-source"
import { Category } from "../database/models/Category";

export class CategoryService {

  static handleGetCategory = (idCategory)=>{
    return new Promise(async(resolve, reject)=>{
      try{
        if(!idCategory){
          const categories = await AppDataSource.getRepository(Category)
            .createQueryBuilder("category")
            .getMany()
          resolve({
            errCode: 0,
            message: "Get all Category successfully!",
            data: categories
          })
        }
        const category = await AppDataSource.getRepository(Category)
          .createQueryBuilder("category")
          .where("category.id = :id", { id: idCategory})
          .getOne()
        if(!category){
          resolve({
            errCode: 2,
            message: "Category not exist",
          })
        }
        resolve({
          errCode: 0,
          message: "Get Category successfully!",
          data: category
        })
      }catch(e){
        reject(e);
      }
    })
  }

  static handleCreateCategory= async (data) => {
    return new Promise(async (resolve, reject) => {
      try {
        if(!data.name){
          return resolve({
            errCode:1,
            errMessage: "Missing input value!"
          })
        }
        const category = await AppDataSource.getRepository(Category)
        .createQueryBuilder("category")
        .where("category.name = :name", { name: data.name})
        .getRawOne()
        if(category){
          return resolve({
            errCode: 2, 
            errMessage: "category đã có trong database.Vui lòng thư lại!"
          })
        }
        await AppDataSource.getRepository(Category)
        .createQueryBuilder()
        .insert()
        .into(Category)
        .values(
            { name: data.name }
        )
        .execute()
        resolve({
          errCode: 0,
          message: "Create Category successfully!",
        });
      } catch (e) {
        reject(e)
      }
    })
  }


  static handleUpdateCategory = async(data)=>{
    try{
      const categoryUpdate = await AppDataSource
      .createQueryBuilder()
      .update(Category)
      .set({ name: data.name })
      .where("id = :id", { id: data.id })
      .execute()
      if(categoryUpdate.affected==0) {
        return {
          code: 404,
          errMessage: "Category not found!" 
        }
      }
      return {
        code: 200,
        message: "Update category success"
      }
    }catch(err: any) {
        console.log("err:::", err.message)
    }
  }

  static handleDeleteCategory = async (idCategory)=>{
    try{
      const categoryDelete = await AppDataSource.createQueryBuilder()
      .delete()
      .from(Category)
      .where("id = :id", { id: idCategory })
      .execute()
      if(categoryDelete.affected==0) {
        return {
          code: 404,
          errMessage: "Category not found!" 
        }
      }
      return {
        code: 200,
        message: "Delete category success"
      }
    }catch(err: any) {
      console.log("err:::", err.message)
    }
  }
}
