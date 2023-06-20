module.exports = (app) => {
  const projects = require("../controllers/config/project.controller.js");

  const router = require("express").Router();

  // Create a project.
  router.post("/", projects.create);

  // Retrieve all project findAllById
  router.get("/", projects.findAll);
  router.get("/findAllById/:id", projects.findAllById);

  // Retrieve all active project
  router.get("/active", projects.findAllActive);
  router.get("/getObjectwithId", projects.findObjectWithId);
  router.get("/getIdAndName", projects.getIdAndName);

  // Retrieve a single project with id
  router.get("/:id", projects.findOne);

  router.get("/findbyname/:project_name", projects.findByName);

  
  // Update a project with id
  router.put("/:id", projects.update);

  // Delete a project with id
  router.delete("/:id", projects.delete);

  app.use("/api/projects", router);
};
