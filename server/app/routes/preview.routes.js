module.exports = (app) => {
  const preview = require("../controllers/misc/preview.controller.js");

  let router = require("express").Router();

  // Read the metadata details of table.
  router.get("/mysql/", preview.mysqlPreviewTable);
  router.get("/postgresql/", preview.postgresqlPreviewTable);
  router.get("/mssql/", preview.myssqlPreviewTable);
  router.get("/oracle/", preview.oraclePreviewTable);
  router.get("/snowflake/", preview.snowflakePreviewTable);
  router.get("/awss3/csv", preview.awss3PreviewObjectCsv);
  router.get("/awss3/xlsx", preview.awss3PreviewObjectExcel);
  router.get("/localserver/csv", preview.localServerFilePreviewCsv);
  router.get("/localserver/xlsx",preview.localServerFilePreviewExcel);
  router.get("/restapi/",preview.restApiPreview);

  
  app.use("/api/preview", router);
};
