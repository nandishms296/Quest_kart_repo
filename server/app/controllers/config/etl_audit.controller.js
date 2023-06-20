const db = require("../../models");
const audit = db.configModels.tbl_etl_audit;
const Op = db.Sequelize.Op;
const logger = require("../../config/logger");

// Create and Save new etl_audit objects
exports.create = (req, res) => {
  // validate request
  if (!req.body.length) {
    logger.error("Content can't be empty!.", {
      exportFunction: "etl_audit.controller.create",
    });

    res.status(400).send({
      message: "Content can't be empty!.",
    });
    return;
  }

  const etl_audits = req.body.map((audit) => {
    return {
      pipeline_id: audit.pipeline_id,
      "task/pipeline_name": audit["task/pipeline_name"],
      run_id: audit.run_id,
      iteration: audit.iteration,
      audit_type: audit.audit_type,
      audit_value: audit.audit_value,
      process_dttm: audit.process_dttm,
    };
  });

  //Save etl_audits in the Database.
  audit
    .bulkCreate(etl_audits)
    .then((data) => {
      logger.info("etl_audit created", {
        exportFunction: "etl_audit.controller.create",
      });

      res.send(data);
    })
    .catch((err) => {
      logger.error("Error occurred while creating the etl_audit", {
        exportFunction: "etl_audit.controller.create",
      });

      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the etl_audits.",
      });
    });
};

// To fetch all the Etl_audit table details
exports.findAll = (req, res) => {
  // var project_id = parseInt(req.query.project_id);

  db.sequelizeConfig
    .query(`SELECT * FROM tbl_etl_audit  `, { model: audit })
    .then((data) => {
      logger.info("finding the value from file type in etl_audit", {
        exportFunction: "etl_audit.controller.findFile",
      });

      res.send(data);
    })
    .catch((err) => {
      logger.error(
        "error while finding the value friom the file type in etl_audit",
        { exportFunction: "etl_audit.controller.findFile" }
      );
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving etl_audit.",
      });
    });
};

// Find LastTaskRunId
exports.findLastRunId = (req, res) => {
  db.sequelizeConfig
    .query(
      `SELECT * FROM tbl_etl_audit WHERE run_id=(SELECT max(run_id)  FROM tbl_etl_audit)`,
      { model: audit }
    )
    .then((data) => {
      logger.info("finding the value of last rin_id in etl_audit", {
        exportFunction: "etl_audit.controller.findLastRunId",
      });

      res.send(data);
    })
    .catch((err) => {
      logger.error(
        "error while finding the value of last rin_id in etl_audit",
        { exportFunction: "etl_audit.controller.findLastRunId" }
      );

      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving etl_audit.",
      });
    });
};
