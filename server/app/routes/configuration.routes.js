module.exports = (app) => {
  const configuration = require("../controllers/core/configuration.controller.js");

  const router = require("express").Router();
  router.post("/", configuration.create);
  router.put("/:id", configuration.update);
  router.get("/getConfigurations", configuration.getConfigurations);

  // Retrieve all Program
  router.get("/", configuration.findAll);
  router.get("/connectionType", configuration.getConnectionType);
  router.get(
    "/connectionSubType/:connection_type",
    configuration.getConnectionSubType
  );
  router.get("/connectionForm", configuration.getConnectionForm);
  router.get("/taskForm", configuration.getTaskForm);
  router.get("/objectform/:name", configuration.getObjectNewForm);
  
  router.get("/getProjectCount", configuration.getProjectCount);
  router.get("/getFrequentlyusedobjects", configuration.getFrequentlyusedobjects);

  // Retrieve all published Program
  router.get("/active", configuration.findAllActive);

  // Reterive field list
  router.get(
    "/getFieldListForName",
    configuration.getFieldsListForConfigration
  );
  router.get(
    "/getFieldListForConnection",
    configuration.getFieldsListForConnection
  );
  router.delete("/:id", configuration.delete);

  app.use("/api/configurations", router);
};
