const db = require("../../models");
const Connection = db.configModels.tbl_connection;
const ConnectionList = db.configModels.vw_connection_list;
const ConnectionDetail = db.configModels.tbl_connection_detail;
const Op = db.Sequelize.Op;
const { uploadFileToGitHub } = require("../../config/github");

const crypto = require("crypto");

const URLSafeBase64 = require("urlsafe-base64");
const logger = require("../../config/logger");

function encrypt(val) {
  const CRYPTO_KEY = "8ookgvdIiH2YOgBnAju6Nmxtp14fn8d3";
  const CRYPTO_IV = "rBEssDfxofOveRxR";
  let cipher = crypto.createCipheriv("AES-256-CBC", CRYPTO_KEY, CRYPTO_IV);
  // UTF-8 to Base64 encoding
  let encrypted = cipher.update(val, "utf8", "base64");
  encrypted += cipher.final("base64");
  return URLSafeBase64.encode(encrypted);
}

function decrypt(encrypted) {
  const CRYPTO_KEY = "8ookgvdIiH2YOgBnAju6Nmxtp14fn8d3";
  const CRYPTO_IV = "rBEssDfxofOveRxR";
  encrypted = URLSafeBase64.decode(encrypted);
  let decipher = crypto.createDecipheriv("AES-256-CBC", CRYPTO_KEY, CRYPTO_IV);
  // Base64 to UTF-8 decoding
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
}

// Create and Save a new Connection

exports.create = async (req, res) => {
   const existingConnection = await Connection.findOne({
     where: { connection_name: req.body.connection_name },
   });
   if (existingConnection) {
     res.status(400).send({
       message: "connection_name  already exists.",
     });
     return;
   }
  let transaction;
  const {
    connection_type: connectionType,
    connection_subtype: connectionSubType,
    connection_name: connectionName,
    project_id: projectId,
    details,
  } = req.body;

  //Create a connection.
  const connectionRecord = {
    project_id: projectId,
    connection_type: connectionType,
    connection_subtype: connectionSubType,
    connection_name: connectionName,
    is_active: "Y",
    created_by: "admin",
    updated_by: "admin",
  };
  //Save Task in the Database.
  try {
    transaction = await db.sequelizeConfig.transaction();
    const data = await Connection.create(connectionRecord, {
      transaction: transaction,
    });
    //  Now loop thru the details to insert record into ConnectionDetails table.
    const detailsRecords =
      details &&
      details.map((item) => {
        if (item.key_01 === 'password' || item.key_01 === 'access_key' || item.key_01 === 'secret_access_key') {
          // Apply the encrypt() function to the value_01 of that object to encrypt the password.
          const encryptedPassword = encrypt(item.value_01); // Replace the original value_01 with the encrypted password.
          return {
            ...item,
            value_01: encryptedPassword,
            connection_id: data.id,
            is_active: "Y",
            created_by: "admin",
            updated_by: "admin",
          };
        } else {
          return {
            ...item,
            connection_id: data.id,
            is_active: "Y",
            created_by: "admin",
            updated_by: "admin",
          };
        }
      });

    const result = await ConnectionDetail.bulkCreate(detailsRecords, {
      transaction: transaction,
    });
    await transaction.commit();
    const resultObj = {};
    for (const item of result) {
      const key = item.key_01;
      let value = item.value_01;
      // if (key === 'access_key' || key === 'secret_access_key') {
      //   value = encrypt(value);
      // }
      resultObj[key] = value;
    }

    
    const combinedData = {
      project_id: projectId,
      connection_type: connectionType,
      connection_subtype: connectionSubType,
      connection_name: connectionName,
      connection_details: resultObj,
    };
    const jsonData = JSON.stringify(combinedData, null, 2);
    // Upload file to GitHub
    const fileName = `common/config/${connectionRecord.connection_name}.json`;
    const message = `created connection ${connectionRecord.connection_name}`;
    const operationType = "create"
    await uploadFileToGitHub(fileName, jsonData, message, operationType);
    logger.info("connection has been created",{exportFunction: "connection.controller.create"});
    res.send(req.body);
  } catch (error) {
    console.log(error)
    logger.error("error occurred while creating the connection",{exportFunction: "connection.controller.create"})
    await transaction.rollback();
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while creating the connection.",
    });
  }
};

// Update a Connection by the id in the request
exports.update = async (req, res) => {
  const connId = req.params.id;

  let transaction;
  const {
    connection_type: connectionType,
    connection_subtype: connectionSubType,
    connection_name: connectionName,
    project_id: projectId,
    id: id,
    details,
  } = req.body;

  //Create a connection.
  const connectionRecord = {
    id: id,
    project_id: projectId,
    connection_type: connectionType,
    connection_subtype: connectionSubType,
    connection_name: connectionName,
    is_active: "Y",
    created_by: "admin",
    updated_by: "admin",
  };

  try {
    transaction = await db.sequelizeConfig.transaction();
    await Connection.update(
      connectionRecord,
      {
        where: { id: connId },
      },
      {
        transaction: transaction,
      }
    );
    await ConnectionDetail.destroy(
      { where: { connection_id: connId } },
      {
        transaction: transaction,
      }
    );
    const detailsRecords =
      details &&
      details.map((item) => {
        if (
          item.key_01 === "password" ||
          item.key_01 === "access_key" ||
          item.key_01 === "secret_access_key"
        ) {
          // Apply the encrypt() function to the value_01 of that object to encrypt the password.

          const encryptedPassword = encrypt(item.value_01); // Replace the original value_01 with the encrypted password.

          return {
            ...item,

            value_01: encryptedPassword,

            connection_id: connId,

            is_active: "Y",

            created_by: "admin",

            updated_by: "admin",
          };
        } else {
          return {
            ...item,

            connection_id: connId,

            is_active: "Y",

            created_by: "admin",

            updated_by: "admin",
          };
        }
      });

    console.log("detailRecords: ", detailsRecords);
    const result = await ConnectionDetail.bulkCreate(detailsRecords, {
      transaction: transaction,
    });
    console.log("BulkInsert Result: ", result);
    await transaction.commit();
    const resultObj = {};
    for (const item of result) {
      const key = item.key_01;
      let value = item.value_01;
      if (key === 'password' || key === 'access_key' || key === 'secret_access_key') {
        value = encrypt(value);
      }
      resultObj[key] = value;
    }

    const combinedData = {
      project_id: projectId,
      connection_type: connectionType,
      connection_subtype: connectionSubType,
      connection_name: connectionName,
      connection_details: resultObj,
    };
    const jsonData = JSON.stringify(combinedData, null, 2);
    // Upload file to GitHub
    const fileName = `common/config/${connectionRecord.connection_name}.json`;
    const message = `updated connection ${connectionRecord.connection_name}`;
    const operationType = "update"
    await uploadFileToGitHub(fileName, jsonData, message, operationType);


    logger.info("connection updated successfully", {
      exportFunction: "connection.controller.update",
    });
    res.send({
      message: " Connection updated scuccessfully.",
    });
  } catch (error) {
    logger.error("error updating connection", {
      exportFunction: "connection.controller.update",
    });
    await transaction.rollback();
    res.status(500).send({
      message: error.message || "Error updating Connection with id=" + connId,
    });
  }
};

exports.findOne = (req, res) => {
  const id = req.params.id;

  Connection.findByPk(id)
    .then((data) => {
      if (data) {
        logger.info("Fetching the connection with id", {
          exportFunction: "connection.controller.findOne",
        });
        res.send(data);
      } else {
        logger.info("cannot find the connection with id", {
          exportFunction: "connection.controller.findOne",
        });
        res.status(404).send({
          message: `Cannot find Connection with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      logger.error("error retriveing the connection with the id", {
        exportFunction: "connection.controller.findOne",
      });
      res.status(500).send({
        message: "Error retrieving Connection with id=" + id,
      });
    });
};

exports.findConnectionByID = (req, res) => {
  const id = req.params.id;

  db.sequelizeConfig
    .query(
      `SELECT project_name,connection_type,connection_subtype,connection_name,fields_list as connection_details 
          FROM config.vw_connection_list WHERE id = ${id}`,
      {
        model: ConnectionList,
      }
    )
    .then((data) => {
      console.log("Result of Query: ", data);
      res.send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Connections.",
      });
    });
};

// Reterive all connection from the database.
exports.findAll = (req, res) => {
  const project_id = parseInt(req.query.project_id);
  const condition = project_id ? { project_id: { [Op.eq]: project_id } } : null;
  console.log("Condition: ", condition);
  let sql = "";
  if (condition) {
    sql = `SELECT * FROM tbl_connection WHERE project_id = ${project_id}`;
  } else {
    sql = `SELECT * FROM tbl_connection`;
  }
  /* Project.findAll(
        { attributes: ["id","program_id","project_name","project_description","project_manager","project_lead","is_active"]},
        { where: condition }) */
  db.sequelizeConfig
    .query(sql, { model: Connection })
    .then((data) => {
      logger.info("finding all the connection", {
        exportFunction: "connection.controller.findAll",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error finding all the connection", {
        exportFunction: "connection.controller.findAll",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Connection.",
      });
    });
};

// Delete a Connection with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Connection.update(
    { is_active: "N" },
    {
      where: { id: id, is_active: "N" },
    }
  )
    .then((num) => {
      if (num == 1) {
        logger.info("connection was soft deleted successfully", {
          exportFunction: "connection.controller.delete",
        });
        res.send({
          message: "Connection was soft delete scuccessfully.",
        });
      } else {
        logger.info("cannot soft delete connection", {
          exportFunction: "connection.controller.delete",
        });
        res.send({
          message: `Cannot soft delete Connection with id=${id}. Maybe Connection was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.error("error soft deleting the connection", {
        exportFunction: "connection.controller.delete",
      });
      res.status(500).send({
        message: "Error soft deleting Connection with id=" + id,
      });
    });
};

// Find all published Connection
exports.findAllActive = (req, res) => {
  Connection.findAll({ where: { is_active: "Y" } })
    .then((data) => {
      logger.info("finding all the active connection", {
        exportFunction: "connection.controller.findallactive",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error occured while retriving connection", {
        exportFunction: "connection.controller.findallactive",
      });
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving active Connection.",
      });
    });
};

exports.findAllWithDetails = async (req, res) => {
  try {
    const data = await ConnectionList.findAll();
    res.send(data);
    logger.info("retrieving the connections list", {
      exportFunction: "connection.controller.findallwithdetails",
    });
  } catch (error) {
    logger.error("error while retrieving view connections list", {
      exportFunction: "connection.controller.findallwithdetails",
    });
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while retrieving view Connections List.",
    });
  }
};

exports.getcount = (req, res) => {
  Connection.findAndCountAll({
    where: {
      is_active: "Y",
    },
  })

    .then((data) => {
      logger.info("retriving the connection with the count", {
        exportFunction: "connection.controller.getcount",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error retriving the connection with the count", {
        exportFunction: "connection.controller.getcount",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Connection.",
      });
    });
};
