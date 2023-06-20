module.exports = (app) => {
  const task_parameters = require("../controllers/config/task_parameter.controller");

  const router = require("express").Router();
  router.post("/", task_parameters.create);
  // router.put("/", task_parameters.update);
  
  router.get("/", task_parameters.findAll);
  router.get("/task_id/:task_id/:task_type", task_parameters.findAll1);
  router.get("/task_type", task_parameters.findAllTasktype);
  router.get("/active", task_parameters.findAllActive);
  router.get("/task_id/:task_id", task_parameters.findObjectWithId);

  router.get(
    "/Source/:connection_subtype/:connection_name",
    task_parameters.findAllfieldsSource
  );
  router.get("/delete/:task_id/:task_type", task_parameters.delete2);

  router.get(
    "/Target/:connection_subtype/:connection_name",
    task_parameters.findAllfieldsTarget
  );

  router.get("/count", task_parameters.getcount);
  router.get("/project_id/:project_id", task_parameters.findProject);

  // router.get("/count", pipelines.getCount);
  // router.get("/ASC", pipelines.getSort1);
  // router.get("/DES", pipelines.getSort2);
  // Retrieve a single Task_parameter with id

  router.get("/:id", task_parameters.findOne);

  router.get("/DQ/:task_id", task_parameters.findAllDQ);
  router.get("/SqlExecution/:task_id", task_parameters.findAllSqlExecution);

  // Update a Task_parameters with id
  router.put("/:task_id", task_parameters.update);
  router.post("/createSQL/", task_parameters.createSQL);
  router.put("/updateSQL/:task_id", task_parameters.updateSQL);
  // Delete a Task_parameters with id
  router.delete("/:id", task_parameters.delete);

  app.use("/api/task_parameters", router);
};
