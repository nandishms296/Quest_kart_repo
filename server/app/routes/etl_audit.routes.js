module.exports = (app) => {
  const etl_audit = require("../controllers/config/etl_audit.controller");
  const router = require("express").Router();
  // Create a etl_audit.
  router.post("/", etl_audit.create);
  router.get("/", etl_audit.findAll);
  router.get("/getLastRunId", etl_audit.findLastRunId);
  app.use("/api/audit", router);
};
