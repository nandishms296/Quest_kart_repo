module.exports = (app) => {
  const conn = require("../controllers/misc/testconnection.controller");

  const router = require("express").Router();

  router.post("/mysql", conn.mysqlConnectionCheck);
  router.post("/postgresql", conn.postgreSqlConnection);
  router.post("/snowflake", conn.snowflakeConnection);
  router.post("/oracle", conn.oracleConnection);
  router.post("/awss3", conn.AWSConnection);
  router.post("/mssql", conn.mssqlConnection);
  router.post("/sfdc", conn.SFDCConnection);
  router.post("/redshift", conn.reshiftConnection);
  router.post("/remoteserver", conn.remoteserver);
  router.post("/localserver", conn.localserver);
  router.post("/restapi/basic", conn.RestAPI);
  router.post("/restapi/access_token", conn.RestAPItoken);
  app.use("/api/testconnection", router);
};
