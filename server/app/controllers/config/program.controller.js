const db = require("../../models");
const Program  = db.configModels.tbl_program;
const Op = db.Sequelize.Op;
const logger = require('../../config/logger');
const { uploadFileToGitHub } = require("../../config/github");

// Create and Save a new Program
exports.create = (req, res) => {
  // validate request
  if (!req.body.program_name) {
    res.status(400).send({
      message: "Content can't be empty!.",
    });
    return;
  }

  //Create a Program.
  const program = {
    program_name: req.body.program_name,
    program_description: req.body.program_description,
    primary_stakeholder: req.body.primary_stakeholder,
    secondary_stakeholder: req.body.secondary_stakeholder,
    is_active: "Y",
    created_by: req.body.created_by,
  };

  
Program.create(program)
  .then((data) => {
    // Generate JSON data
    const jsonData = JSON.stringify(data, null, 2);

    const programObj = JSON.parse(jsonData);

    // Modify the values
    programObj.created_dttm = new Date();
    programObj.updated_dttm = new Date();

    // Convert the JavaScript object back to JSON
    const modifiedJsonData = JSON.stringify(programObj, null, 2);
    
    const fileName = `program/${data.program_name}.json`; // createing filename based on program_name

    uploadFileToGitHub(
      fileName,
      modifiedJsonData,
      "Add program data",
      "create"
    )
      .then(() => {
        res.send(data);
        logger.info("program created and pushed to GitHub", 
        {exportFunction: "program.controller.create",});
      })
      .catch((err) => {
        console.log(err)
        logger.error(
          "error occurred while pushing JSON file to GitHub",
          { exportFunction: "program.controller.create" }
        );
        res.status(500).send({
          message:
            err.message ||
            "Some error occurred while creating the Program.",
        });
      });
  })
  .catch((err) => {
    logger.error(
      "error occurred while creating the program",
      { exportFunction: "program.controller.create" }
    );
    res.status(500).send({
      message:
        err.message || "Some error occurred while creating the Program.",
    });
  });
};

// Reterive all Programs from the database.
exports.findAll = (req, res) => {
    const program_name = req.query.program_name;
    const condition = program_name ? { program_name: { [Op.like]: `%{program_name}`} }: null;

    Program.findAll(
        { attributes: ["id","program_name","program_description","primary_stakeholder","secondary_stakeholder","is_active"]},
        { where: condition })
    .then(data => {
        logger.info("retrieving all the program",{exportFunction: "program.controller.findAll"});
        res.send(data);
    })
    .catch(err => {
        logger.error("error occurred while retrieving the program",{exportFunction: "program.controller.findAll"});
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Program."
        });
    });
};

// Find a single Programs with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Program.findByPk(id)
    .then(data => {
        if (data) {
            logger.info("finding the program by id",{exportFunction: "program.controller.findOne"})
        res.send(data);
        } else {
            logger.info("cannot find program by id",{exportFunction: "program.controller.findOne"})
            res.status(404).send({
                message: `Cannot find Program with id=${id}.`
            });
        }
    })
    .catch(err => {
        logger.error("error retrieving program with id",{exportFunction: "program.controller.findOne"});
        res.status(500).send({
            message: "Error retrieving Program with id=" + id
        });
    });
};


exports.findByName = async (req, res) => {
  const program_name = req.params.program_name;
  try {
    const data = await Program.findOne({ where: { program_name: program_name } });
      res.send(data);
    
  } catch (err) {
    logger.error("error retrieving program with program_name",{exportFunction: "program.controller.findByName"});
    res
      .status(500)
      .send({ message: "Error occured while fetching " + err.message });
  }
};
// Update a Programs by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  const programName = req.body.program_name;

  Program.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        logger.info("program was updated successfully", {
          exportFunction: "program.controller.update",
        });

        const fileName = `program/${programName}.json`;
        Program.findOne({ where: { program_name: programName } }).then((program) => {
          const jsonData = JSON.stringify(program, null, 2);
          uploadFileToGitHub(fileName, jsonData, "Updated program data", "update")
            .then(() => {
              res.send({
                message: "Program was updated successfully and pushed to GitHub.",
              });
              logger.info("program updated and pushed to GitHub", {
                exportFunction: "program.controller.update",
              });
            })
            .catch((err) => {
              console.log(err);
              logger.error(
                "error occurred while pushing JSON file to GitHub",
                { exportFunction: "program.controller.update" }, err
              );
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while updating the program.",
              });
            });
        });
      } else {
        logger.info("Cannot update program", {
          exportFunction: "program.controller.update",
        });
        res.send({
          message: `Cannot update Program with id=${id}. Maybe Program was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.error("error while updating the program", {
        exportFunction: "program.controller.update",
      });
      res.status(500).send({
        message: "Error updating Program with id=" + id,
      });
    });
};

// Delete a Programs with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Program.update({is_active : "N"}, {
      where: {id : id,
    is_active: 'N' }
    })
    .then(num => {
      if (num == 1) {
        logger.info("program was soft deleted successfully",{exportFunction: "program.controller.delete"});
          res.send({
              message: "Program was soft delete scuccessfully."
          });
      } else {
        logger.info("cannot sof delete the program",{exportFunction: "program.controller.delete"});
          res.send({
              message: `Cannot soft delete Program with id=${id}. Maybe Program was not found or req.body is empty!`
          });
      }
    })
    .catch(err => {
        logger.error("error soft deleting the program",{exportFunction: "program.controller.delete"})
      res.status(500).send({
          message: "Error soft deleting Program with id=" + id
        });
    });
};

// Find all Programs
exports.findAllActive = (req, res) => {
  Program.findAll({ where: {is_active: "Y"} })
  .then(data => {
    logger.info("finding all the active program",{exportFunction: "program.controller.findAllActive"});
    res.send(data);
  })
  .catch(err => {
    logger.error("error occurred while retrieving active program",{exportFunction: "program.controller.findAllActive"});
    res.status(500).send({
        message:
        err.message || "Some error occurred while retrieving programs."
    });
  });
};

exports.getIdAndName = (req, res) => {

    let sql = "SELECT id, program_name as name FROM tbl_program where is_active = 'Y'";
    console.log("SQL: ", sql);

    db.sequelizeConfig.query(
            sql, 
            {model: Program})
    .then(data => {
        logger.info("retrieving id and name of program",{exportFunction: "program.controller.getIdAndName"});
      res.send(data);
    })
    .catch(err => {
        logger.error("error occurred while retrieving id and name",{exportFunction: "program.controller.getIdAndName"});
      res.status(500).send({
          message:
          err.message || "Some error occurred while retrieving active projects."
      });
    }); 
};