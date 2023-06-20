module.exports = (app) => {
  const details = require("../controllers/core/configuration_detail.controller");

  const router = require("express").Router();
  router.post("/", details.create);
  router.put("/:id", details.update);
  router.get("/findAllById/:id", details.findAllById);
  router.get("/getConfigurationDetails", details.getConfigurationDetails);

  // Retrieve all Program
  router.get("/", details.findAll);

  // Retrieve all published Program
  router.get("/active", details.findAllActive);
  router.delete("/:id", details.delete);

  app.use("/api/configuration_details", router);
};
