const db = require("../../models");
const Details  = db.coreModels.tbl_configuration_detail;
const Op = db.Sequelize.Op;
const logger = require('../../config/logger');

// Create and Save a new Details
exports.create = (req, res) => {
    // validate request
    if (!req.body.configuration_id) {
        logger.error("Content can't be empty!.",{exportFunction: "configuration_detail.controller.create"});

        res.status(400).send({
            message: "Content can't be empty!."
        });
        return;
    }

    //Create a Details.
    const details = {
        configuration_id: req.body.configuration_id,
        display_sequence: req.body.display_sequence,
        key_01: req.body.key_01,
        value_01: req.body.value_01,
        required: 'Y',
        key_02: req.body.key_02,
        value_02: req.body.value_02, 
        field_type: req.body.field_type,
        remarks: req.body.remarks,
        is_active: 'Y',
        created_by: req.body.created_by
    };

    //Save Details in the Database.
    Details.create(details)
    .then(data => {
        logger.info("Configuration_detail created",{exportFunction: "configuration_detail.controller.create"});

        res.send(data);
    })
    .catch(err => {
        logger.error("Error occurred while creating the Details",{exportFunction: "configuration_detail.controller.create"});
        res.status(500).send({
            
            message:
            err.message || "Some error occurred while creating the Details."
        });
    });
};


// Update a Details by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Details.update(req.body, {
        where: {id : id }
    })
    .then(num => {
        if (num == 1) {
            logger.info("Configuration_Details was updated successfully",{exportFunction: "configuration_detail.controller.update"});
            res.send({
                message: "Configuration_Details was updated scuccessfully."
            });
        } else {
            logger.info("Cannot update Configuration_Details",{exportFunction: "configuration_detail.controller.update"});
            res.send({
                message: `Cannot update Configuration_Details with id=${id}. Maybe configuration_detail was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        logger.error("error while updating the Configuration_Details",{exportFunction: "configuration_detail.controller.update"})
        res.status(500).send({
            message: "Error updating Configuration_Details with id=" + id
        });
    });
  };
  

  // Delete a Details with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Details.update({is_active : "N"}, {
      where: {id : id,
    is_active: 'Y' }
    })
    .then(num => {
      if (num == 1) {
        logger.info("Configuration_Details was soft deleted successfully",{exportFunction: "configuration_detail.controller.delete"});
          res.send({
              message: "Configuration_Details was soft delete scuccessfully."
          });
      } else {
        logger.info("cannot soft delete the Configuration_Details",{exportFunction: "configuration_detail.controller.delete"});
          res.send({
              message: `Cannot soft delete Configuration_Details with id=${id}. Maybe configuration_detail was not found or req.body is empty!`
          });
      }
    })
    .catch(err => {
        logger.error("error soft deleting the Configuration_Details",{exportFunction: "configuration_detail.controller.delete"})
      res.status(500).send({
          message: "Error soft deleting Configuration_Details with id=" + id
        });
    });
  };
exports.findAllById = (req, res) => {
    
    const configuration_id = parseInt(req.params.configuration_id);
    const condition = configuration_id ? configuration_id : null;
    let sql = '';
    console.log("Condition: ", condition);
    if ( !condition ) {
       
        sql = `SELECT * FROM tbl_configuration JOIN tbl_configuration_detail ON tbl_configuration.id = tbl_configuration_detail.configuration_id`;
    } else {
        sql = `SELECT * FROM tbl_configuration JOIN tbl_configuration_detail ON tbl_configuration.id = tbl_configuration_detail.configuration_id WHERE configuration_id = ${configuration_id}`;
    }
    console.log("Condition: ", condition);

    db.sequelizeCore.query(
            sql, 
            {model: Details})
    .then(data => {
        logger.info("retrieving the configuration_detail by id",{exportFunction: "configuration_detail.controller.findAllById"});
        res.send(data);
    })
    .catch(err => {
        logger.error("error occurred while retrieving configuration_detail by id",{exportFunction: "configuration_detail.controller.findAllById"});
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving configuration_detail."
        });
    });
};


exports.getConfigurationDetails = async (req, res, next) => {
    try {
      // Fetch configuration names and ids from the tbl_configuration table
      const configQuery = `SELECT id, configuration_name FROM tbl_configuration WHERE is_active = 'Y'`;
      const [configRows] = await db.sequelizeCore.query(configQuery);
      
      const query = `SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE, ORDINAL_POSITION
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = 'tbl_configuration_detail' AND COLUMN_NAME NOT IN ('id','created_by','created_dttm','updated_by','updated_dttm')`;
        const [rows] = await db.sequelizeCore.query(query);

          const initialValues = {};
          const fieldList = [];
      
          rows.forEach(row => {
            const key = row.COLUMN_NAME;
            const type = key === 'is_active' ? "checkbox" : (key === 'configuration_id' ? 'select' : 'text');
            const display_label = key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
            const isRequired = row.IS_NULLABLE === 'NO' ? 'Y' : 'N';
            let option_list = null;

            if (key === 'configuration_id') {
                // Set the options list to the configuration names and ids
                option_list = configRows.map(row => ({id: row.id.toString(), name: row.configuration_name}));
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
          const json = [{
            initialvalues: initialValues,
            field_list: fieldList
          }];
          logger.info("configuration_detail data retrieved successfully",{exportFunction: "configuration_detail.controller.getConfigurationDetails"});

          res.json(json);
        } catch (err) {
           logger.error("Error occurred while retrieving configuration_detail data",{exportFunction: "configuration_detail.controller.getConfigurationDetails"});

          next(err);
    }
};
      

// Reterive all Programs from the database.
exports.findAll = (req, res) => {
    const id = req.query.configuration_id;
    const condition = id ? { configuration_id: { [Op.eq]: `${id}`} }: null;

    Details.findAll({ where: condition })
    .then(data => {
        logger.info("retrieving all the configuration_detail",{exportFunction: "configuration_detail.controller.findAll"});
        res.send(data);
    })
    .catch(err => {
        logger.error("error while retrieving all the configuration_detail",{exportFunction: "configuration_detail.controller.findAll"});
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Configuration_Details."
        });
    });
};


// Find all Programs
exports.findAllActive = (req, res) => {
    Details.findAll({ where: {is_active: "Y"} })
    .then(data => {
        logger.info("finding all the active configuration_details",{exportFunction: "configuration_detail.controller.findAllActive"});
        res.send(data);
    })
    .catch(err => {
        logger.error("error while finding all the active configuration_details",{exportFunction: "configuration_detail.controller.findAllActive"});
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Configuration_Details."
        });
    });
};
// Reterive all Programs from the database.
exports.findFile = (req, res) => {

    Details.findAll(
        
        {  
            where: {value_01:"File",key_01:"connection *" },
            attributes: ["valye_02"]
        }
        )
    .then(data => {
       logger.info("finding the value from file type in configuration_details",{exportFunction: "configuration_detail.controller.findFile"});
        res.send(data);
    })
    .catch(err => {
        logger.error("error while finding the value friom the file type in configuration_details",{exportFunction: "configuration_detail.controller.findFile"});
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Configuration_Details."
        });
    });
};


exports.findcontype = (req, res) => {
    
    db.sequelizeConfig.query(
        // `SELECT distinct value_01 FROM core1.tbl_configuration_detail where configuration_id = 4`, 
        `with main as (SELECT distinct value_01 ,value_02 FROM core1.tbl_configuration_detail where configuration_id =4
            order by 1,2)
            select value_01, json_arrayagg(json_object('value_02',value_02)) as value_02 from main
            group by value_01`,
        {model: Details})
    .then(data => { 
        logger.info("finding the connection type",{exportFunction: "configuration_detail.controller.findcontype"});
        console.log("Result of Query: ",data);
        res.send(data);
    })
    .catch(err => {
        logger.error("error while finding the connection type",{exportFunction: "configuration_detail.controller.findcontype"})
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving connection."
        });
    });
}

exports.findconsubtypetype = (req, res) => {
    const value_01 = req.params.value_01;
    const condition = value_01 ? { value_01: { [Op.eq]: value_01 } }: null;
    console.log("Condition: ", condition);
    db.sequelizeConfig.query(
        `SELECT distinct value_02 FROM core1.tbl_configuration_detail where value_01 = "${value_01}"`,  
        {model: Details})
    .then(data => { 
        logger.info("finding the connection subtype",{exportFunction: "configuration_detail.controller.findconsubtypetype"});
        console.log("Result of Query: ",data);
        res.send(data);
    })
    .catch(err => {
        logger.error("error while finding the connection subtype",{exportFunction: "configuration_detail.controller.findconsubtypetype"})
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Connection subtypes."
        });
    });
}
