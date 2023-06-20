module.exports = (app) => {
  const connections = require("../controllers/config/connection.controller");

  const router = require("express").Router();

  // Create a Pipeline.
  router.post("/", connections.create);

  // Retrieve all Pipeline
  router.get("/", connections.findAll);
  router.get("/connectionlist", connections.findAllWithDetails);
  router.get("/connectionlist/:id", connections.findConnectionByID);

  // Retrieve all active connections
  router.get("/active", connections.findAllActive);

  router.get("/count", connections.getcount);
  // router.get("/ASC", pipelines.getSort1);
  // router.get("/DES", pipelines.getSort2);
  // Retrieve a single connections with id
  router.get("/:id", connections.findOne);

  // Update a connections with id
  router.put("/:id", connections.update);

  // Delete a connections with id
  router.delete("/:id", connections.delete);

  app.use("/api/connections", router);
};
