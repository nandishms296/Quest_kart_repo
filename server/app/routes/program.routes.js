module.exports = (app) => {
  const programs = require("../controllers/config/program.controller.js");

  const router = require("express").Router();

  // Create a Program.
  router.post("/", programs.create);

  // Retrieve all Program
  router.get("/", programs.findAll);

  // Retrieve all published Program
  router.get("/active", programs.findAllActive);

  //List of Id and Name of Program
  router.get("/getIdAndName", programs.getIdAndName);

  // Retrieve a single Program with id
  router.get("/:id", programs.findOne);

  router.get("/findbyname/:program_name", programs.findByName);
  
  // Update a Program with id
  router.put("/:id", programs.update);

  // Delete a Program with id
  router.delete("/:id", programs.delete);

  app.use("/api/programs", router);
};
