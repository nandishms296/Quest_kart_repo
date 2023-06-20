module.exports = (app) => {
  const authController = require("../controllers/misc/auth.controller");

  const router = require("express").Router();

  // Register User from Signup Screen.
  router.put("/forgetpassword", authController.forgotPassword);
  router.put("/resetpassword", authController.resetPassword);
  router.put("/changepassword", authController.changePassword);

  router.post("/", authController.login);

  app.use("/auth", router);
};
