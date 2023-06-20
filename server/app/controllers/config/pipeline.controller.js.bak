const db = require("../../models");
const Pipeline = db.configModels.tbl_pipeline;
const PipelineFlow = db.configModels.vw_pipeline_flow;
const Op = db.Sequelize.Op;
const logger = require("../../config/logger");
const { uploadFileToGitHub } = require("../../config/github");
// Create and Save a new Pipeline
exports.create = (req, res) => {
  // validate request
  if (!req.body.pipeline_name) {
    res.status(400).send({
      message: "Content can't be empty!.",
    });
    return;
  }

  //Create a Pipeline.
  const pipeline = {
    project_id: req.body.project_id,
    pipeline_name: req.body.pipeline_name,
    pipeline_cd: req.body.pipeline_cd,
    pipeline_description: req.body.pipeline_description,
    pipeline_sequence: req.body.pipeline_sequence,
    is_active: "Y",
    created_by: req.body.created_by,
  };

  //Save Pipeline in the Database.
  Pipeline.create(pipeline)
    .then((data) => {
      // Generate JSON data
      const jsonData = JSON.stringify(data, null, 2);

      const pipelineObj = JSON.parse(jsonData);

      // Modify the values
      pipelineObj.created_dttm = new Date();
      pipelineObj.updated_dttm = new Date();

      // Convert the JavaScript object back to JSON
      const modifiedJsonData = JSON.stringify(pipelineObj, null, 2);

      const fileName = `program/ingestion_kart/pipeline/${data.pipeline_name}.json`; // createing filename based on program_name

      uploadFileToGitHub(
        fileName,
        modifiedJsonData,
        "Add pipeline data",
        "create"
      )
        .then(() => {
          res.send(data);
          logger.info("pipeline created and pushed to GitHub", {
            exportFunction: "pipeline.controller.create",
          });
        })
        .catch((err) => {
          logger.error("error occurred while pushing JSON file to GitHub", {
            exportFunction: "pipeline.controller.create",
          });
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the pipeline.",
          });
        });
    })
    .catch((err) => {
      logger.error("error occurred while creating the pipeline", {
        exportFunction: "pipeline.controller.create",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the pipeline.",
      });
    });
};

// Reterive all Pipeline from the database.
exports.findAll = (req, res) => {
  const project_id = parseInt(req.query.project_id);
  db.sequelizeConfig
    .query(
      `SELECT id, pipeline_name, pipeline_cd, pipeline_description, pipeline_sequence, is_active FROM tbl_pipeline WHERE project_id = ${project_id}`,
      { model: Pipeline }
    )
    .then((data) => {
      logger.info("retrieving all the pipelines", {
        exportFunction: "pipeline.controller.findAll",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error occurred while retrieving the pipeline", {
        exportFunction: "pipeline.controller.findAll",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Pipeline.",
      });
    });
};

exports.getPipelineFlow = (req, res) => {
  const pipeline_id = parseInt(req.params.id);
  const condition = { where: { pipeline_id: `${pipeline_id}` } };
  db.sequelizeConfig
    .query(
      `SELECT pipeline_id, nodes, edges FROM vw_pipeline_flow WHERE pipeline_id = ${pipeline_id}`,
      { model: PipelineFlow }
    )
    .then((data) => {
      logger.info("Fetching Records for pipeline task flow ", {
        exportFunction: "pipeline.controller.getPipelineFlow",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error(
        "error occurred while retrieving active pipeline task flows",
        {
          exportFunction: "pipeline.controller.getPipelineFlow",
        }
      );
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving pipeline task flows.",
      });
    });
};

// Reterive all Pipeline from the database.
exports.findAllById = (req, res) => {
  const project_id = parseInt(req.params.project_id);
  const condition = project_id ? project_id : null;
  let sql = "";
  console.log("Condition: ", condition);
  if (!condition) {
    sql = `SELECT id,project_id, pipeline_name, pipeline_cd, pipeline_description, pipeline_sequence, is_active FROM tbl_pipeline`;
  } else {
    sql = `SELECT id,project_id, pipeline_name, pipeline_cd, pipeline_description, pipeline_sequence, is_active FROM tbl_pipeline WHERE project_id = ${project_id}`;
  }

  console.log("Condition: ", condition);

  db.sequelizeConfig
    .query(sql, { model: Pipeline })
    .then((data) => {
      logger.info("retrieving the pipelines by id", {
        exportFunction: "pipeline.controller.findAllById",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error occurred while retrieving pipeline by id", {
        exportFunction: "pipeline.controller.findAllById",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Pipeline.",
      });
    });
};

// Find a single Pipeline with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Pipeline.findByPk(id)
    .then((data) => {
      if (data) {
        logger.info("finding the pipeline by id", {
          exportFunction: "pipeline.controller.findOne",
        });
        res.send(data);
      } else {
        logger.info("cannot find pipeline by id", {exportFunction: "pipeline.controller.findOne",});
        res.status(404).send({
          message: `Cannot find Pipeline with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      logger.error("error retrieving pipeline with id", {exportFunction: "pipeline.controller.findOne",});
      res.status(500).send({
        message: "Error retrieving Pipeline with id=" + id,
      });
    });
};

// Update a Pipeline by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;

  // Validate request
  if (!req.body.pipeline_name) {
    res.status(400).send({
      message: "Pipeline name can't be empty!.",
    });
    return;
  }

  Pipeline.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        // Generate JSON data
        Pipeline.findByPk(id)
          .then((data) => {
            const jsonData = JSON.stringify(data, null, 2);
            const fileName = `program/ingestion_kart/pipeline/${data.pipeline_name}.json`;

            uploadFileToGitHub(
              fileName,
              jsonData,
              "Update pipeline data",
              "update"
            )
              .then(() => {
                logger.info("Pipeline was updated successfully and pushed to GitHub",{ exportFunction: "pipeline.controller.update" });
                res.send({
                  message: "Pipeline was updated successfully.",
                });
              })
              .catch((err) => {
                logger.error("Error occurred while pushing JSON file to GitHub",{ exportFunction: "pipeline.controller.update" });
                res.status(500).send({
                  message: err.message || "Some error occurred while updating the pipeline.",
                });
              });
          })
          .catch((err) => {
            logger.error("Error occurred while finding the pipeline", {exportFunction: "pipeline.controller.update",});
            res.status(500).send({
              message: err.message || "Some error occurred while updating the pipeline.",
            });
          });
      } else {
        logger.info("Cannot update Pipeline", {exportFunction: "pipeline.controller.update",});
        res.send({
          message: `Cannot update Pipeline with id=${id}. Maybe Pipeline was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.error("Error while updating the pipeline", {exportFunction: "pipeline.controller.update",});
      res.status(500).send({
        message: "Error updating Pipeline with id=" + id,
      });
    });
};

// Delete a Pipeline with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Pipeline.update({ is_active: "N" },    {
      where: { id: id, 
      is_active: "Y" },
    })
    .then((num) => {
      if (num == 1) {
        logger.info("pipeline was soft deleted successfully", { exportFunction: "pipeline.controller.delete",});
        res.send({
          message: "Pipeline was soft delete scuccessfully.",
        });
      } else {
        logger.info("cannot soft delete the pipeline", {exportFunction: "pipeline.controller.delete",});
        res.send({
          message: `Cannot soft delete Pipeline with id=${id}. Maybe Pipeline was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.error("error soft deleting the pipeline", {exportFunction: "pipeline.controller.delete",});
      res.status(500).send({
        message: "Error soft deleting Pipeline with id=" + id,
      });
    });
};

// Find all Active Pipeline
exports.findAllActive = (req, res) => {
  Pipeline.findAll({ where: { is_active: "Y" } })
    .then((data) => {
      logger.info("finding all the active pipelines", {exportFunction: "pipeline.controller.findAllActive",});
      res.send(data);
    })
    .catch((err) => {
      logger.error("error occurred while retrieving active pipelines", {exportFunction: "pipeline.controller.findAllActive",});
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving active Pipeline.",
      });
    });
};

exports.getIdAndName = (req, res) => {
  let sql =
    "SELECT id, pipeline_name as name FROM tbl_pipeline where is_active = 'Y'";
  console.log("SQL: ", sql);

  db.sequelizeConfig
    .query(sql, { model: Pipeline })
    .then((data) => {
      res.send(data);
      logger.info("retrieving id and name of pipeline", {exportFunction: "pipeline.controller.getIdAndName",});
    })
    .catch((err) => {
      logger.error("error occurred while retrieving id and name of pipeline", {exportFunction: "pipeline.controller.getIdAndName",});
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving active projects.",
      });
    });
};
