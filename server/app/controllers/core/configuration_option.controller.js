const db = require("../../models");
const Options  = db.coreModels.tbl_configuration_option;
const Op = db.Sequelize.Op;
const logger = require('../../config/logger');


// Create and Save a new Options
exports.create = (req, res) => {
    // validate request
    if (!req.body.configuration_detail_id) {
        logger.error("Content can't be empty!.",{exportFunction: "configuration_option.controller.create"});
        res.status(400).send({
            message: "Content can't be empty!."
        });
        return;
    }
  
    //Create a Options.
    const options = {
        configuration_detail_id: req.body.configuration_detail_id,
        display_sequence: req.body.display_sequence,
        configuration_item:req.body.configuration_item,
        field_id:req.body.field_id,
        display_name:req.body.display_name,
        key_01:req.body.key_01,
        value_01:req.body.value_01,
        field_type:req.body.field_type,
        remarks:req.body.remarks,
        is_active: 'Y',
        created_by:req.body.created_by,
        configuration_id:req.body.configuration_id,
        required:req.body.required,
        key_02:req.body.key_02,
        valye_02:req.body.valye_02,
        category:req.body.category,

    };

  
    //Save Options in the Database.
    Options.create(options)
    .then(data => {
        logger.info("Configuration_option created",{exportFunction: "configuration_option.controller.create"});
        res.send(data);
    })
    .catch(err => {
        logger.error("Error occurred while creating the Options",{exportFunction: "configuration_option.controller.create"});

        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the Options."
        });
    });
  };

// Reterive all Programs from the database.
exports.findAll = (req, res) => {
    const item = req.query.configuration_name;
    const condition = item ? { configuration_item: { [Op.like]: `%{item}`} }: null;

    Options.findAll({ where: condition })
    .then(data => {
        logger.info("retrieving all the configuration_option",{exportFunction: "configuration_option.controller.findAll"});
        res.send(data);
    })
    .catch(err => {
        logger.info("error while retrieving all the configuration_option",{exportFunction: "configuration_option.controller.findAll"});
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Configuration_Options."
        });
    });
};

// Find all Programs
exports.findAllActive = (req, res) => {
    Options.findAll({ where: {is_active: "Y"} })
    .then(data => {
        logger.info("finding all the active configuration_option",{exportFunction: "configuration_option.controller.findAllActive"});
        res.send(data);
    })
    .catch(err => {
        logger.error("error while finding all the active configuration_option",{exportFunction: "configuration_option.controller.findAllActive"});
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Configuration_Options."
        });
    });
};
exports.getConfigurationOptions = async (req, res, next) => {
    try {
      // Fetch configuration_details  key_01 and ids from the tbl_configuration_details table
      const configQuery = `SELECT id, key_01 FROM tbl_configuration_detail WHERE is_active = 'Y'`;
      const [configRows] = await db.sequelizeCore.query(configQuery);
      const query = `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, ORDINAL_POSITION
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tbl_configuration_option' AND COLUMN_NAME NOT IN ('id','created_by','created_dttm','updated_by','updated_dttm')`;
        const [rows] = await db.sequelizeCore.query(query);

          const initialValues = {};
          const fieldList = [];
      
          rows.forEach(row => {
            const key = row.COLUMN_NAME;
            const type = key === 'is_active' ? "checkbox" : (key === 'configuration_detail_id' ? 'select' : 'text');
            const display_label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const isRequired = row.IS_NULLABLE === 'NO' ? 'Y' : 'N';
            let option_list = null;
            if (key === 'configuration_detail_id') {
                // Set the options list to the configuration names and ids
                option_list = configRows.map(row => ({id: row.id.toString(), name: row.key_01}));
              }
      
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
            // Move the is_active field to the end of the fieldList
          const activeFieldIndex = fieldList.findIndex(field => field.field_id === 'is_active');
          const activeField = fieldList.splice(activeFieldIndex, 1)[0];
          fieldList.push(activeField);
          const json = [{
            initialvalues: initialValues,
            field_list: fieldList
          }];
          logger.info("Configuration_option data retrieved successfully",{exportFunction: "configuration_option.controller.getConfigurationOptions"});

          res.json(json);
        } catch (err) {
          logger.error("Error occurred while retrieving Configuration_option data",{exportFunction: "configuration_option.controller.getConfigurationOptions"});

          next(err);
    }
};
  
  // Update a Options by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Options.update(req.body, {
        where: {id : id }
    })
    .then(num => {
        if (num == 1) {
            logger.info("Configuration_Options was updated successfully",{exportFunction: "configuration_option.controller.update"});
            res.send({
                message: "Configuration_Options was updated scuccessfully."
            });
        } else {
            logger.info("Cannot update Configuration_Options",{exportFunction: "configuration_option.controller.update"});
            res.send({
                message: `Cannot update Configuration_Options with id=${id}. Maybe configuration_option was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        logger.error("error while updating the Configuration_Options",{exportFunction: "configuration_option.controller.update"})
        res.status(500).send({
            message: "Error updating Configuration_Options with id=" + id
        });
    });
  };
  

  // Delete a Details with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Options.update({is_active : "N"}, {
      where: {id : id,
    is_active: 'Y' }
    })
    .then(num => {
      if (num == 1) {
        logger.info("Configuration_Options was soft deleted successfully",{exportFunction: "configuration_option.controller.delete"});
          res.send({
              message: "Configuration_Options was soft delete scuccessfully."
          });
      } else {
        logger.info("cannot soft delete the Configuration_Options",{exportFunction: "configuration_option.controller.delete"});
          res.send({
              message: `Cannot soft delete Configuration_Options with id=${id}. Maybe configuration_option was not found or req.body is empty!`
          });
      }
    })
    .catch(err => {
        logger.error("error soft deleting the Configuration_Options",{exportFunction: "configuration_option.controller.delete"})
      res.status(500).send({
          message: "Error soft deleting Configuration_Options with id=" + id
        });
    });
  };
exports.findAllById = (req, res) => {
    
    const configuration_detail_id = parseInt(req.params.configuration_detail_id);
    const condition = configuration_detail_id ? configuration_detail_id : null;
    let sql = '';
    console.log("Condition: ", condition);
    if ( !condition ) {
       
        sql = `SELECT * , tbl_configuration_detail.key_01 AS details_key_01 FROM tbl_configuration_detail JOIN tbl_configuration_option ON tbl_configuration_detail.id = tbl_configuration_option.configuration_detail_id`;
    } else {
        sql = `SELECT * , tbl_configuration_detail.key_01 AS details_key_01FROM tbl_configuration_detail JOIN tbl_configuration_option ON tbl_configuration_detail.id = tbl_configuration_option.configuration_id WHERE configuration_detail_id = ${configuration_detail_id}`;
    }
    console.log("Condition: ", condition);

    db.sequelizeCore.query(
            sql, 
            {model: Options})
    .then(data => {
        logger.info("retrieving the configuration_option by id",{exportFunction: "configuration_option.controller.findAllById"});
        res.send(data);
    })
    .catch(err => {
        logger.error("error occurred while retrieving configuration_option by id",{exportFunction: "configuration_option.controller.findAllById"});
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving configuration_option."
        });
    });
};

