module.exports = (app) => {
  const registerController = require("../controllers/misc/register.controller");

  const router = require("express").Router();

  // Register User from Signup Screen.
  router.post("/", registerController.register);

  app.use("/register", router);
};
