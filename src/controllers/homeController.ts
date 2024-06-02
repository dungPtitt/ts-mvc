
export class HomeController {
  static getHomePage(req, res) {
    try {
      return res.render("login.ejs", { data: null });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errCode: -1,
        errMessage: "Err from server!",
      });
    }
  }
  static getRegisterPage(req, res) {
    try {
      return res.render("register.ejs", { data: null });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errCode: -1,
        errMessage: "Err from server!",
      });
    }
  }
  static getDashboard(req, res) {
    try {

      return res.render("dashboard.ejs", { data: null });
    } catch (e) {
      console.log(e);
      return res.status(500).json({
        errCode: -1,
        errMessage: "Err from server!",
      });
    }
  }
}
