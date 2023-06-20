module.exports = (app) => {
  const refreshTokenController = require("../controllers/misc/refreshToken.controller");

  const router = require("express").Router();

  // Register User from Signup Screen.
  router.get("/", refreshTokenController.handleRefreshToken);

  app.use("/refresh", router);
};
