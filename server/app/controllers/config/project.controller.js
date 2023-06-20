const db = require("../../models");
const Project  = db.configModels.tbl_project;
const Op = db.Sequelize.Op;
const logger = require('../../config/logger');
const { uploadFileToGitHub } = require("../../config/github");
// Create and Save a new Project
exports.create = (req, res) => {
    // validate request
    if (!req.body.project_name) {
        res.status(400).send({
            message: "Content can't be empty!."
        });
        return;
    }

    //Create a Project.
    const project = {
        program_id: req.body.program_id,
        project_name: req.body.project_name,
        project_description: req.body.project_description,
        project_manager: req.body.project_manager,
        project_lead: req.body.project_lead,
        is_active: 'Y',
        created_by: req.body.created_by
    };

    //Save Project in the Database.
    Project.create(project)
    .then((data) => {
        // Generate JSON data
        const jsonData = JSON.stringify(data, null, 2);

        const projectObj = JSON.parse(jsonData);

    // Modify the values
    projectObj.created_dttm = new Date();
    projectObj.updated_dttm = new Date();

    // Convert the JavaScript object back to JSON
    const modifiedJsonData = JSON.stringify(projectObj, null, 2);

        const fileName = `program/ingestion_kart/${data.project_name}.json`; // createing filename based on program_name
    
        uploadFileToGitHub(
          fileName,
          modifiedJsonData,
          "Add project data",
          "create"
        )
          .then(() => {
            res.send(data);
            logger.info("project created and pushed to GitHub", {
              exportFunction: "project.controller.create",
            });
          })
          .catch((err) => {
            logger.error(
              "error occurred while pushing JSON file to GitHub",
              { exportFunction: "project.controller.create" }
            );
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while creating the project.",
            });
          });
      })
      .catch((err) => {
        logger.error(
          "error occurred while creating the project",
          { exportFunction: "project.controller.create" }
        );
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the project.",
        });
      });
};

exports.findObjectWithId = (req, res) => {
    const program_id = parseInt(req.query.program_id);
    const condition = program_id ? { program_id: { [Op.eq]: program_id } }: null;
    console.log("Condition: ", condition);

    db.sequelizeConfig.query(
        `SELECT id, project_name, project_description, project_manager, project_lead, is_active FROM tbl_project WHERE program_id = ${program_id}`, 
        {model: Project})
    .then(data => { 
        logger.info("finding the objet with id",{exportFunction: "project.controller.findObjectWithId"})
        console.log("Result of Query: ",data);
        res.send(data);
    })
    .catch(err => {
        logger.error("error occured while retriveing the project details",{exportFunction: "project.controller.findObjectWithId"})
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Project."
        });
    });
}

// Reterive all Project from the database.
exports.findAll = (req, res) => {

    const program_id = parseInt(req.params.program_id);
    const condition = program_id ? { program_id: { [Op.eq]: program_id } }: null;
    let sql = '';
    console.log("Condition: ", condition);
    if ( !condition ) {
        sql = "SELECT id, project_name, project_description, project_manager, project_lead, is_active FROM tbl_project";
    } else {
        sql = `SELECT id, project_name, project_description, project_manager, project_lead, is_active FROM tbl_project WHERE program_id = ${program_id}`
    }

/*     Project.findAll(
        { attributes: ["id","program_id","project_name","project_description","project_manager","project_lead","is_active"]},
        { where: condition }) */
    db.sequelizeConfig.query(
            sql, 
            {model: Project})
    .then(data => { 
        logger.info("retrieving all the project",{exportFunction: "project.controller.findAll"});
        res.send(data);
    })
    .catch(err => {
        logger.error("error occurred while retrieving the project",{exportFunction: "project.controller.findAll"});
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Project."
        });
    });
};

exports.findAllById = (req, res) => {

    const program_id = parseInt(req.params.id);
    const condition = program_id ? program_id : null;
    let sql = '';
    console.log("Condition: ", condition);
    if ( !condition ) {
        sql = "SELECT id, program_id, project_name, project_description, project_manager, project_lead, is_active FROM tbl_project";
    } else {
        sql = `SELECT id, program_id, project_name, project_description, project_manager, project_lead, is_active FROM tbl_project WHERE program_id = ${program_id}`
    }
    db.sequelizeConfig.query(
            sql, 
            {model: Project})
    .then(data => { 
        logger.info("retrieving the project by id",{exportFunction: "project.controller.findAllById"});
        res.send(data);
    })
    .catch(err => {
        logger.error("error occurred while retrieving project by id",{exportFunction: "project.controller.findAllById"});
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving Project."
        });
    });
};

// Find a single Project with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    Project.findByPk(id)
    .then(data => {
        if (data) {
            logger.info("finding the project by id",{exportFunction: "project.controller.findOne"})
        res.send(data);
        } else {
            logger.info("cannot find project by id",{exportFunction: "project.controller.findOne"})
            res.status(404).send({
                message: `Cannot find Project with id=${id}.`
            });
        }
    })
    .catch(err => {
        logger.error("error retrieving project with id",{exportFunction: "project.controller.findOne"});
        res.status(500).send({
            message: "Error retrieving Project with id=" + id
        });
    });  
};

exports.findByName = async (req, res) => {
    const project_name = req.params.project_name;
    try {
      const data = await Project.findOne({ where: { project_name: project_name } });
        res.send(data);
      
    } catch (err) {
      logger.error("error retrieving project with project_name",{exportFunction: "project.controller.findByName"});
      res
        .status(500)
        .send({ message: "Error occured while fetching " + err.message });
    }
  };

// Update a Project by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    Project.update(req.body, {
        where: {id : id }
    })
    .then(num => {
        if (num == 1) {
            Project.findByPk(id).then(data => {
              // Generate JSON data
              const jsonData = JSON.stringify(data, null, 2);
              const fileName = `program/ingestion_kart/${data.project_name}.json`; // creating filename based on program_name

              uploadFileToGitHub(
                fileName,
                jsonData,
                "Update project data",
                "update"
              )
                .then(() => {
                  logger.info("project updated and pushed to GitHub", {
                    exportFunction: "project.controller.update",
                  });
                  res.send({
                      message: "Project was updated scuccessfully."
                  });
                })
                .catch((err) => {
                  logger.error(
                    "error occurred while pushing JSON file to GitHub",
                    { exportFunction: "project.controller.update" }
                  );
                  res.status(500).send({
                    message:
                      err.message ||
                      "Some error occurred while updating the project.",
                  });
                });
            });
        } else {
            logger.info("Cannot update project",{exportFunction: "project.controller.update"});
            res.send({
                message: `Cannot update Project with id=${id}. Maybe Project was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        logger.error("error while updating the project",{exportFunction: "project.controller.update"});
        res.status(500).send({
            message: "Error updating Project with id=" + id
        });
    });  
};

// Delete a Project with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    Project.update({is_active : "N"}, {
        where: {id : id,
            is_active: 'N' }
    })
    .then(num => {
      if (num == 1) {
        logger.info("project was soft deleted successfully",{exportFunction: "project.controller.delete"});
          res.send({
              message: "Project was soft delete scuccessfully."
          });
      } else {
        logger.info("cannot soft delete the project",{exportFunction: "project.controller.delete"});
          res.send({
              message: `Cannot soft delete Project with id=${id}. Maybe Project was not found or req.body is empty!`
          });
      }
    })
    .catch(err => {
        logger.error("error soft deleting the project",{exportFunction: "project.controller.delete"})
      res.status(500).send({
          message: "Error soft deleting Project with id=" + id
        });
    });
};

// Find all published Project
exports.findAllActive = (req, res) => {
    Project.findAll({ where: {is_active: "Y"} })
    .then(data => {
        logger.info("finding all the active project",{exportFunction: "project.controller.findAllActive"});
      res.send(data);
    })
    .catch(err => {
        logger.error("error occurred while retrieving active project",{exportFunction: "project.controller.findAllActive"});
      res.status(500).send({
          message:
          err.message || "Some error occurred while retrieving active projects."
      });
    }); 
};

exports.getIdAndName = (req, res) => {

    let sql = "SELECT id, project_name as name FROM tbl_project where is_active = 'Y'";
    console.log("SQL: ", sql);

    db.sequelizeConfig.query(
            sql, 
            {model: Project})
    .then(data => {
        logger.info("retrieving id and name of project",{exportFunction: "project.controller.getIdAndName"});
      res.send(data);
    })
    .catch(err => {
        logger.error("error occurred while retrieving id and name of project",{exportFunction: "project.controller.getIdAndName"});
      res.status(500).send({
          message:
          err.message || "Some error occurred while retrieving active projects."
      });
    }); 
};