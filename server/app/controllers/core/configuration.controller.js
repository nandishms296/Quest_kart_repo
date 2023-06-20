const db = require("../../models");
const Configuration = db.coreModels.tbl_configuration;
const Details = db.coreModels.tbl_configuration_detail;
const ConnectionForm = db.coreModels.vw_conection_form;
const TaskParametersForm = db.coreModels.vw_task_parameter_form;
const ObjectForm = db.coreModels.vw_object_form;
const Op = db.Sequelize.Op;
const logger = require("../../config/logger");


// Create and Save a new Configuration
exports.create = (req, res) => {
  // validate request
  if (!req.body.configuration_name) {
    logger.error("Content can't be empty!.",{exportFunction: "configuration.controller.create"});
      res.status(400).send({
          message: "Content can't be empty!."
      });
      return;
  }

  //Create a Configuration.
  const configuration = {
    configuration_name: req.body.configuration_name,
    additional_detail: req.body.additional_detail,
    is_active: 'Y',
    created_by: req.body.created_by
  };

  //Save Configuration in the Database.
  Configuration.create(configuration)
  .then(data => {
    logger.info("Configuration created",{exportFunction: "configuration.controller.create"});
      res.send(data);
  })
  .catch(err => {
      logger.error("Error occurred while creating the Configuration",{exportFunction: "configuration.controller.create"});
      res.status(500).send({
          message:
          err.message || "Some error occurred while creating the Configuration."
      });
  });
};

// Update a Configuration by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  Configuration.update(req.body, {
      where: {id : id }
  })
  .then(num => {
      if (num == 1) {
          logger.info("Configuration was updated successfully",{exportFunction: "configuration.controller.update"});
          res.send({
              message: "Configuration was updated scuccessfully."
          });
      } else {
          logger.info("Cannot update Configuration",{exportFunction: "configuration.controller.update"});
          res.send({
              message: `Cannot update Configuration with id=${id}. Maybe Configuration was not found or req.body is empty!`
          });
      }
  })
  .catch(err => {
      logger.error("error while updating the configuration",{exportFunction: "configuration.controller.update"})
      res.status(500).send({
          message: "Error updating Configuration with id=" + id
      });
  });
};


// Reterive all the fields of tbl_configuration from the database.
exports.getConfigurations = async (req, res, next) => {
  try {
    const query = `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, ORDINAL_POSITION
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_NAME = 'tbl_configuration' AND COLUMN_NAME NOT IN ('id','created_by','created_dttm','updated_by','updated_dttm')`;

    const [rows] = await db.sequelizeCore.query(query);

    const initialValues = {};
    const fieldList = [];

    rows.forEach(row => {
      const key = row.COLUMN_NAME;
      const type = key === 'is_active' ? "checkbox" : "text";
      const display_label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      const isRequired = row.IS_NULLABLE === 'NO' ? 'Y' : 'N';
      let option_list = null;

      initialValues[key] = "";
      fieldList.push({
        field_id: key,
        field_type: type,
        display_name: display_label,
        required: isRequired,
        option_list: option_list,
        display_sequence: row.ORDINAL_POSITION // Set the id property to the ordinal position of the field

      });
    });
    // Sort the fieldList based on the ordinal position
    fieldList.sort((a, b) => a.display_sequence - b.display_sequence);
    const json = [{
      initialvalues: initialValues,
      field_list: fieldList
    }];
    logger.info("Configuration data retrieved successfully",{exportFunction: "configuration.controller.getConfigurations"});
    res.json(json);
  } catch (err) {

    logger.error("Error occurred while retrieving Configuration data",{exportFunction: "configuration.controller.getConfigurations"});
    next(err);
  }
};



// Delete a Configuration with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Configuration.update({is_active : "N"}, {
    where: {id : id,
  is_active: 'Y' }
  })
  .then(num => {
    if (num == 1) {
      logger.info("configuration was soft deleted successfully",{exportFunction: "configuration.controller.delete"});
        res.send({
            message: "Configuration was soft delete scuccessfully."
        });
    } else {
      logger.info("cannot soft delete the configuration",{exportFunction: "configuration.controller.delete"});
        res.send({
            message: `Cannot soft delete configuration with id=${id}. Maybe configuration was not found or req.body is empty!`
        });
    }
  })
  .catch(err => {
      logger.error("error soft deleting the configuration",{exportFunction: "configuration.controller.delete"})
    res.status(500).send({
        message: "Error soft deleting configuration with id=" + id
      });
  });
};

// Reterive all Configuration from the database.
exports.findAll = (req, res) => {
  const name = req.query.configuration_name;
  const condition = name
    ? { configuration_name: { [Op.like]: `%{name}` } }
    : null;

  Configuration.findAll({ where: condition })
    .then((data) => {
      logger.info("retrieving all the configuration", {
        exportFunction: "configuration.controller.findAll",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.info("error while retrieving all the configuration", {
        exportFunction: "configuration.controller.findAll",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Configuration.",
      });
    });
};

// Find a single Configuration with an id
exports.findOne = (req, res) => {
  const name = req.params.configuration_name;

  Configuration.findOne({ where: { configuration_name: name } })
    .then((data) => {
      if (data) {
        logger.info("retrieving the configuration", {
          exportFunction: "configuration.controller.findOne",
        });
        res.send(data);
      } else {
        res.status(404).send({
          message: `Cannot find Configuration with name=${name}.`,
        });
      }
    })
    .catch((err) => {
      logger.error("error while retrieving the configuration", {
        exportFunction: "configuration.controller.findOne",
      });
      res.status(500).send({
        message: "Error retrieving Configuration with name=" + name,
      });
    });
};

// Find all Configuration
exports.findAllActive = (req, res) => {
  Configuration.findAll({ where: { is_active: "Y" } })
    .then((data) => {
      logger.info("finding all the active configuration", {
        exportFunction: "configuration.controller.findAllActive",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error while finding all the active configuration", {
        exportFunction: "configuration.controller.findAllActive",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving configuration.",
      });
    });
};

exports.getProjectCount = async (req, res) => {
  try {
    const sql = `SELECT * FROM vw_dashboard_counts`;
    const data = await db.sequelizeConfig.query(sql, { model: ObjectForm });
    res.send(data);
    logger.info("retrieving ObjectForm Form View", {
      exportFunction: "configuration.controller.getProjectCount",
    });
  } catch (error) {
    logger.error("error while retrieving ObjectForm Form View", {
      exportFunction: "configuration.controller.getProjectCount",
    });
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while retrieving  Form View.",
    });
  }
};

exports.getFrequentlyusedobjects = async (req, res) => {
  try {
    const sql = `SELECT * FROM vw_frequentlyusedobjects limit 10`;
    const data = await db.sequelizeConfig.query(sql, { model: ObjectForm });
    res.send(data);
    logger.info("retrieving ObjectForm Form View", {
      exportFunction: "configuration.controller.getFrequentlyusedobjects",
    });
  } catch (error) {
    logger.error("error while retrieving ObjectForm Form View", {
      exportFunction: "configuration.controller.getFrequentlyusedobjects",
    });
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while retrieving  Form View.",
    });
  }
};


exports.getFieldsListForConfigration = (req, res) => {
  const name = req.query.name[0].toUpperCase() + req.query.name.slice(1);
  Configuration.findOne({ where: { configuration_name: name } })
    .then((config) => {
      if (config) {
        const name = config.configuration_name;
        db.sequelizeCore
          .query(
            `SELECT value_01 AS field_id, key_01 AS field_label, required AS field_mandatory, key_02 AS field_placeholder, field_type AS field_type 
                    FROM tbl_configuration_detail AS tbl_configuration_detail WHERE configuration_id = ${config.id}`,
            { model: Details }
          )
          .then((detail) => {
            logger.info("retriving all the fields list for configuration", {
              exportFunction:
                "configuration.controller.getFieldsListForConfigration",
            });
            res.send({ page_label: name, fields: detail });
          });
      } else {
        logger.info("cannot retrive all the fields list for configuration", {
          exportFunction:
            "configuration.controller.getFieldsListForConfigration",
        });
        res.status(404).send({
          message: `Cannot find Configuration with name=${name}.`,
        });
      }
    })
    .catch((err) => {
      logger.error(
        "error while retriving all the fields list for configuration",
        {
          exportFunction:
            "configuration.controller.getFieldsListForConfigration",
        }
      );
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving configuration.",
      });
    });
};

exports.getObjectNewForm = async (req, res) => {
  const name = req.params.name;
  try {
    const sql = `select configuration_name, initialvalues, field_list from core.vw_object_form where configuration_name = '${name}'`;
    const data = await db.sequelizeCore.query(sql, { model: ObjectForm });
    res.send(data);
    logger.info("retrieving ObjectForm Form View", {
      exportFunction: "configuration.controller.getObjectNewForm",
    });
  } catch (error) {
    logger.error("error while retrieving ObjectForm Form View", {
      exportFunction: "configuration.controller.getObjectNewForm",
    });
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while retrieving ObjectForm Form View.",
    });
  }
};

exports.getConnectionForm = async (req, res) => {
  try {
    const sql = `SELECT configuration_id, type, connection_type, connection_subtype, initialvalues, fields_list FROM vw_conection_form`;
    const data = await db.sequelizeCore.query(sql, { model: ConnectionForm });
    res.send(data);
    logger.info("retrieving configuration Form View", {
      exportFunction: "configuration.controller.getConnectionForm",
    });
  } catch (error) {
    logger.error("error retrieving configuration Form View", {
      exportFunction: "configuration.controller.getConnectionForm",
    });
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while retrieving Configuration Form View.",
    });
  }
};

exports.getTaskForm = async (req, res) => {
  try {
    const sql = `SELECT section, initialvalues, fields_list FROM vw_task_parameter_form`;
    const data = await db.sequelizeCore.query(sql, {
      model: TaskParametersForm,
    });
    res.send(data);
    logger.info("retrieving task Form View", {
      exportFunction: "configuration.controller.getTaskForm",
    });
  } catch (error) {
    logger.error("error retrieving task Form View", {
      exportFunction: "configuration.controller.getTaskForm",
    });
    res.status(500).send({
      message:
        error.message || "Some error occurred while retrieving Task Form View.",
    });
  }
};

exports.getConnectionType = async (req, res) => {
  try {
    const sql = ` SELECT distinct connection_type FROM core.vw_conection_form`;
    const result = await db.sequelizeCore.query(sql, { model: ConnectionForm });
    const connType = result
      .map((value) => value.connection_type)
      .filter((value, index, _arr) => _arr.indexOf(value) == index);
    res.send(connType);
    logger.info("retrieving connection type from View", {
      exportFunction: "configuration.controller.getConnectionType",
    });
  } catch (error) {
    logger.error("error while retrieving connection type from View", {
      exportFunction: "configuration.controller.getConnectionType",
    });
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while retrieving Configuration Form View.",
    });
  }
};

exports.getConnectionSubType = async (req, res) => {
  const connection_type = req.params.connection_type;
  try {
    const sql = ` SELECT distinct connection_subtype FROM vw_conection_form where connection_type = '${connection_type}'`;
    const result = await db.sequelizeCore.query(sql, { model: ConnectionForm });
    const connSubType = result
      .map((value) => value.connection_subtype)
      .filter((value, index, _arr) => _arr.indexOf(value) == index);
    res.send(connSubType);
    logger.info("retrieving connection subtype from View", {
      exportFunction: "configuration.controller.getConnectionSubType",
    });
  } catch (error) {
    logger.error("error while retrieving connection sub type from View", {
      exportFunction: "configuration.controller.getConnectionSubType",
    });
    res.status(500).send({
      message:
        error.message ||
        "Some error occurred while retrieving Configuration Form View.",
    });
  }
};

exports.getFieldsListForConfigration1 = (req, res) => {
  const name = req.query.name[0].toUpperCase() + req.query.name.slice(1);
  Configuration.findOne({ where: { configuration_name: name } })
    .then((config) => {
      if (config) {
        const name = config.configuration_name;
        db.sequelizeCore
          .query(
            `select sec, connection_subtype, connection_name,field_id, display_name As field_label, field_type, case when field_type = 'select' then listvalue else null end as value
                from (
                select sec, connection_subtype, connection_name,field_id, display_name, field_type, JSON_ARRAYAGG(JSON_OBJECT('value_01', value_01)) as listvalue
                from config.vw_task1
                where display_sequence != 0
                group by sec, connection_subtype, connection_name, display_name, field_type
                order by sec, connection_subtype) tmp;`,
            { model: Details }
          )
          .then((detail) => {
            res.send({ page_label: name, fields: detail });
            logger.info("retrieving Configuration with name", {
              exportFunction:
                "configuration.controller.getFieldsListForConfigration1",
            });
          });
      } else {
        logger.info("cannot retrive Configuration with name", {
          exportFunction:
            "configuration.controller.getFieldsListForConfigration1",
        });
        res.status(404).send({
          message: `Cannot find Configuration with name=${name}.`,
        });
      }
    })
    .catch((err) => {
      logger.error("error while retrieving Configuration with name", {
        exportFunction:
          "configuration.controller.getFieldsListForConfigration1",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving configuration.",
      });
    });
};
exports.getFieldsListForConnection = (req, res) => {
  const name = "Connection";
  config = Configuration.findOne({ where: { configuration_name: name } })
    .then((config) => {
      if (config) {
        db.sequelizeCore
          .query(
            `with
                tco as (select configuration_detail_id,  
                        JSON_ARRAYAGG(JSON_OBJECT('display_name',tco.display_name , 'key_01', tco.key_01, 'value_01', tco.value_01 ,'field_type', tco.field_type)) as json_value
                        from core.tbl_configuration_option tco
                        group by configuration_detail_id ),
                tcd as (select configuration_id, tcd.value_01 , tcd.required , tcd.key_02, tcd.field_type , JSON_ARRAYAGG(JSON_OBJECT('value_02', tcd.valye_02    ,'fields_list', tco.json_value)) as value
                        from core.tbl_configuration_detail tcd  
                        left outer join tco on tcd.id = tco.configuration_detail_id
                        group by configuration_id, tcd.value_01,tcd.required, tcd.key_02, tcd.field_type )  
                select  tcd.value_01 ,  tcd.required ,  tcd.key_02, tcd.field_type , tcd.value
                from core.tbl_configuration tc
                left outer join tcd on tc.id = tcd.configuration_id
                where tc.id = ${config.id}`,
            { model: Details, Model: Options }
          )
          .then((detail) => {
            logger.info("retrieving Configuration details with name", {
              exportFunction:
                "configuration.controller.getFieldsListForConnection",
            });
            res.send(detail);
          });
      } else {
        logger.info("cannot retrive Configuration details with name", {
          exportFunction: "configuration.controller.getFieldsListForConnection",
        });
        res.status(404).send({
          message: `Cannot find Configuration with name=${name}.`,
        });
      }
    })
    .catch((err) => {
      logger.error("error while retriving Configuration details with name", {
        exportFunction: "configuration.controller.getFieldsListForConnection",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving configuration.",
      });
    });
};
