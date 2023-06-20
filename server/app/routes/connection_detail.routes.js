module.exports = (app) => {
  const connection_details = require("../controllers/config/connection_detail.controller");

  const router = require("express").Router();

  // Create a Connection Detail.
  router.post("/", connection_details.create);

  router.post("/delete1/:connection_id", connection_details.delete1);
  // Retrieve all Connection Detail
  router.get("/", connection_details.findAll);

  // Update a Connection Detail with id
  router.put("/:connection_id", connection_details.update);

  // Update a Connection Detail with id
  router.get("/connection_id", connection_details.findObjectWithId);

  app.use("/api/connection_details", router);
};
