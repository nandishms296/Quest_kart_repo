const db = require("../../models");
const ColumnReference = db.configModels.lkp_column_reference;
const Op = db.Sequelize.Op;
const logger = require("../../config/logger");
// Create and Save a new lkp
exports.create = async (req, res) => {
  // validate request
  if (req.body.length === 0) {
    res.status(400).send({
      message: "Content can't be empty!.",
    });
    return;
  }

  const records = req.body;

  try {
    const transaction = await db.sequelizeConfig.transaction();
    await ColumnReference.bulkCreate(records, {
      transaction: transaction,
    });
    await transaction.commit();
    logger.info("Records inserted successfully", {
      exportFunction: "columnreference.controller.create",
    });
    res.send({
      message: "Records inserted successfully.",
    });
  } catch (error) {
    logger.error("Some error occurred while inserting records", {
      exportFunction: "columnreference.controller.create",
    });
    res.status(500).send({
      message: error.message || "Some error occurred while inserting records",
    });
  }
};
// Reterive all lkp from the database.

exports.findAll = (req, res) => {
  const sql = `SELECT * FROM lkp_column_reference tp`;
  db.sequelizeConfig
    .query(sql, { model: ColumnReference })
    .then((data) => {
      logger.info("retriving all from lkp column reference", {
        exportFunction: "columnreference.controller.findAll",
      });
      res.send({ rows: data });
    })
    .catch((err) => {
      logger.info(
        "Some error occurred while retrieving from lkp column reference",
        {
          exportFunction: "columnreference.controller.findAll",
        }
      );
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Pipeline.",
      });
    });
};
//****************************************************************** */

exports.coloumnName = (req, res) => {
  let sql = `SELECT column_name as field
    FROM information_schema.columns
    WHERE table_name='lkp_column_reference'`;

  db.sequelizeConfig
    .query(sql, { model: ColumnReference })
    .then((data) => {
      logger.info("retriving columns from lkp column reference", {
        exportFunction: "columnreference.controller.coloumnName",
      });
      res.send({ columns: data });
    })
    .catch((err) => {
      logger.error(
        "error occurred while retrieving columns from lkp column reference",
        {
          exportFunction: "columnreference.controller.coloumnName",
        }
      );
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving columns from lkp column reference.",
      });
    });
};

exports.coloumnNames = (req, res) => {
  let sql = `SELECT COLUMN_NAME
    FROM INFORMATION_SCHEMA.COLUMNS 
    WHERE TABLE_SCHEMA=config1
        AND TABLE_NAME='lkp_column_referenc`;

  db.sequelizeConfig
    .query(sql, { model: ColumnReference })
    .then((data) => {
      logger.info("retriving column names from lkp column reference", {
        exportFunction: "columnreference.controller.coloumnNames",
      });
      res.send({ columns: data });
    })
    .catch((err) => {
      logger.error(
        "error occurred while retrieving column names from lkp column reference",
        {
          exportFunction: "columnreference.controller.coloumnNames",
        }
      );
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Pipeline.",
      });
    });
};

exports.deleteRecord = async (req, res) => {
  const { connection_id, table_name, schema_name } = req.params;

  try {
    const transaction = await db.sequelizeConfig.transaction();
    await ColumnReference.destroy(
      {
        where: {
          connection_name: connection_id,
          schema_name: schema_name,
          table_name: table_name,
        },
      },
      {
        transaction: transaction,
      }
    );
    await transaction.commit();
    logger.info("Records deleted successfully", {
      exportFunction: "columnreference.controller.deleteRecord",
    });
    res.send({
      message: "Records deleted successfully.",
    });
  } catch (error) {
    logger.error("error occurred while deleting records", {
      exportFunction: "columnreference.controller.deleteRecord",
    });
    res.status(500).send({
      message: error.message || "Some error occurred while deleting records",
    });
  }
};
