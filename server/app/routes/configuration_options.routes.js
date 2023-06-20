module.exports = (app) => {
  const options = require("../controllers/core/configuration_option.controller");

  const router = require("express").Router();
  router.post("/", options.create);
  router.put("/:id", options.update);

  router.get("/findAllById/:id", options.findAllById);

  router.get("/getConfigurationOptions", options.getConfigurationOptions);
  // Retrieve all Program
  router.get("/", options.findAll);

  // Retrieve all published Program
  router.get("/active", options.findAllActive);

  app.use("/api/configuration_options", router);
};
