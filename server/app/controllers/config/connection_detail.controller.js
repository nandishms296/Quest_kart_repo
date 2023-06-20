const { query } = require("express");
const db = require("../../models");
const ConnectionDetail = db.configModels.tbl_connection_detail;
const connection = db.configModels.tbl_connection;
const Op = db.Sequelize.Op;

const logger = require("../../config/logger");

// Create and Save a new connection
exports.create = (req, res) => {
  const ConnectionDetail = {
    // connection_id: req.body.connection_id,
    connection_id: req.body.connection_id,
    key_01: req.body.key_01,
    value_01: req.body.value_01,
    sequence: req.body.sequence,
    is_active: "Y",
    created_by: "system",
  };
  //Save connection in the Database.
  ConnectionDetail.create(ConnectionDetail)
    .then((data) => {
      res.send(data);
      logger.info("connection details created", {
        exportFunction: "connection_detail.controller.create",
      });
    })
    .catch((err) => {
      logger.error(err, "Some error occurred while creating the User", {
        exportFunction: "connection_detail.controller.create",
      });
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while creating the ConnectionDetail.",
      });
    });
};

// Reterive all Project from the database.
exports.findAll = (req, res) => {
  const connection_id = parseInt(req.query.connection_id);
  const condition = connection_id
    ? { connection_id: { [Op.eq]: connection_id } }
    : null;
  console.log("Condition: ", condition);
  let sql = "";
  if (condition) {
    sql = `SELECT id, connection_id, key_01, value_01 FROM config.tbl_connection_detail WHERE connection_id = ${connection_id}`;
  } else {
    sql = `SELECT id, connection_id, key_01, value_01 FROM config.tbl_connection_detail`;
  }
  db.sequelizeConfig
    .query(sql, { model: ConnectionDetail })
    .then((data) => {
      logger.info("Retrieved all the connection details", {
        exportFunction: "connection_detail.controller.findall",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error(
        err,
        "Some error occurred while retrieving all connection detail",
        { exportFunction: "connection_detail.controller.findall" }
      );
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Connection .",
      });
    });
};

exports.findObjectWithId = (req, res) => {
  const connection_id = parseInt(req.query.connection_id);
  const condition = connection_id
    ? { connection_id: { [Op.eq]: connection_id } }
    : null;
  console.log("Condition: ", condition);

  db.sequelizeConfig
    .query(
      `SELECT id, key_01, value_01 FROM tbl_ConnectionDetail WHERE connection_id = ${connection_id}`,
      { model: ConnectionDetail }
    )
    .then((data) => {
      console.log("Result of Query: ", data);
      logger.info("retrieved the connection detail with the id", {
        exportFunction: "connection_detail.controller.findobjectwithid",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error(
        "Some error occurred while retrieving Connection detail with id",
        { exportFunction: "connection_detail.controller.findobjectwithid" }
      );
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Connections.",
      });
    });
};

exports.findSequence = (req, res) => {
  const connection_id = parseInt(req.query.connection_id);
  const condition = connection_id
    ? { connection_id: { [Op.eq]: connection_id } }
    : null;
  console.log("Condition: ", condition);

  db.sequelizeConfig
    .query(
      `SELECT id, key_01, value_01 FROM tbl_connection_detail WHERE connection_id = ${connection_id}`,
      { model: ConnectionDetail }
    )
    .then((data) => {
      logger.info("fetched the sequence", {
        exportFunction: "connection_details.controller.findSequence",
      });
      console.log("Result of Query: ", data);
      res.send(data);
    })
    .catch((err) => {
      logger.error("error occurred while retrieving sequence", {
        exportFunction: "connection_details.controller.findSequence",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Connections.",
      });
    });
};

// Update a Project by the id in the request
exports.update = (req, res) => {
  const connection_id = req.params.connection_id;
  ConnectionDetail.update(req.body, {
    where: { connection_id: connection_id },
  })
    .then((num) => {
      if (num == 1) {
        logger.info("connection details updated successfully", {
          exportFunction: "connection_details.controller.update",
        });
        res.send({
          message: "ConnectionDetail was updated successfully.",
        });
      } else {
        logger.info("connection details cannot be updated", {
          exportFunction: "connection_details.controller.update",
        });
        res.send({
          message: `Cannot update ConnectionDetail with connection_id=${connection_id}. Maybe ConnectionDetails was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.error("error updating the connection details", {
        exportFunction: "connection_details.controller.update",
      });
      res.status(500).send({
        message: "Error updating ConnectionDetail with id=" + connection_id,
      });
    });
};

exports.delete1 = (req, res) => {
  const connection_id = req.params.connection_id;
  const condition = connection_id
    ? { connection_id: { [Op.eq]: connection_id } }
    : null;
  console.log("Condition: ", condition);

  db.sequelizeConfig
    .query(
      `DELETE FROM tbl_connection_detail WHERE connection_id =${connection_id}`,
      { model: ConnectionDetail }
    )
    .then((data) => {
      logger.info(
        "deleting the connection details",
        { exportFunction: "connection_details.controller.delete" },
        data
      );
      console.log("Result of Query: ", data);
      res.send(data);
    })
    .catch((err) => {
      logger.error("error occured while deleting the connection details", {
        exportFunction: "connection_details.controller.findSequence",
      });
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Connection details.",
      });
    });
};
