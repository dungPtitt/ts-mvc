
import { CategoryService } from "../services/CategoryService";

export class CategoryController {
  static createCategory = async (req, res) => {
    try {
      let data = req.body;
      let response: any = await CategoryService.handleCreateCategory(data);
      if (response.errCode == 0) {
        return res.redirect("/category/get");
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

  static getCategory = async (req, res) => {
    try {
      let idCategory = req.query.id;
      let response: any = await CategoryService.handleGetCategory(idCategory);
      return res.render("category/listCategory.ejs", { data: response.data });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        errCode: -1,
        errMessage: "Error from server!"
      })
    }
  }

  static getViewEditCategory = async (req, res) => {
    try {
      let idCategory = req.query.id;
      let data = {
        name: ""
      }
      if (idCategory != -1) {
        let response: any = await CategoryService.handleGetCategory(idCategory);
        data = response.data;
      }
      return res.render("category/EditAddCategory.ejs", { data: data, idCategory: idCategory });
    } catch (e) {
      console.log(e);
      res.status(500).json({
        errCode: -1,
        errMessage: "Error from server!"
      })
    }
  }

  static updateCategory = async (req, res) => {
    try {
      let data = req.body;
      let response: any = await CategoryService.handleUpdateCategory(data);
      if (response.code == 200) {
        return res.redirect("/category/get");
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
  static deleteCategory = async (req, res) => {
    try {
      let idCategory = req.query.id;
      let response: any = await CategoryService.handleDeleteCategory(idCategory);
      if (response.code == 200) {
        return res.redirect("/category/get");
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
}
