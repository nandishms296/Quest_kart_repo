module.exports = (app) => {
  const columnreference = require("../controllers/config/columnreference.controller");

  const router = require("express").Router();

  // Create a lkp.
  router.post("/", columnreference.create);

  // Retrieve all lkp
  router.get("/", columnreference.findAll);
  router.get("/columnName", columnreference.coloumnName);
  router.get("/columnNames", columnreference.coloumnNames);

  router.delete(
    "/delete/:connection_id&:schema_name&:table_name",
    columnreference.deleteRecord
  );

  app.use("/api/columnreference", router);
};
