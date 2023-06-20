module.exports = (app) => {
  const pipelines = require("../controllers/config/pipeline.controller");

  const router = require("express").Router();

  // Create a Pipeline.
  router.post("/", pipelines.create);

  // Retrieve all Pipeline
  router.get("/", pipelines.findAll);
  router.get("/findAllById/:id", pipelines.findAllById);
  router.get("/pipelineflow/:id", pipelines.getPipelineFlow);

  // Retrieve all active Pipeline
  router.get("/active", pipelines.findAllActive);
  router.get("/getIdAndName", pipelines.getIdAndName);

  // Retrieve a single Pipeline with id
  router.get("/:id", pipelines.findOne);

  // Update a Pipeline with id
  router.put("/:id", pipelines.update);

  // Delete a Pipeline with id
  router.delete("/:id", pipelines.delete);

  app.use("/api/pipelines", router);
};
