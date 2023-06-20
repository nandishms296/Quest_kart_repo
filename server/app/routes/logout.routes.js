module.exports = (app) => {
  const logoutController = require("../controllers/misc/logout.controller");

  const router = require("express").Router();

  // Register User from Signup Screen.
  router.get("/", logoutController.handleLogout);

  app.use("/logout", router);
};
