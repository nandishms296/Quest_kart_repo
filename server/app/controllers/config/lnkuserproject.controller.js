const db = require("../../models");
const LnkUserProject  = db.configModels.lnk_user_project;
const Op = db.Sequelize.Op;
const User = db.configModels.tbl_user;
const Program  = db.configModels.tbl_program;
const Project  = db.configModels.tbl_project;
const logger = require('../../config/logger');

// Create and Save a new LnkUserProject
exports.create = (req, res) => {
    // validate request
    if (!req.body.user_id) {
        res.status(400).send({
            message: "Content can't be empty!."
        });
        return;
    }

    //Create a Program.
    const lnkuserproj = {
        user_id: req.body.user_id,
        program_id: req.body.program_id,
        project_id: req.body.project_id,
        read_role: req.body.read_role,
        write_role: req.body.write_role,
        execute_role: req.body.execute_role,
        is_active: req.body.is_active,
        created_by: req.body.created_by
    };

    //Save Program in the Database.
    LnkUserProject.create(lnkuserproj)
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while creating the LnkUserProject."
        });
    });
};



// Reterive all LnkUserProject from the database.
exports.findAll = (req, res) => {

    LnkUserProject.findAll({
        attributes: ['id', ['user_id','user'],['program_id','program'],['project_id','project'], 
            ['read_role','read'], ['write_role','write'], ['execute_role','execute'], ['is_active','active']
        ]
      })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving LnkUserProject."
        });
    });
};

exports.getRowsAndColumns = (req, res) => {
    const columnQuery = 'SELECT * FROM config.lnk_user_project LIMIT 1';
    // const rowQuery = 'SELECT * FROM config.lnk_user_project';
    const rowQuery = `
    SELECT 
    JSON_ARRAYAGG(
        JSON_OBJECT(    
            'id', lp.id,
            'user_id', u.login_id,
            'program_id', pr.program_name,
            'project_id', p.project_name,
            'read_role', lp.read_role,
            'write_role', lp.write_role,
            'execute_role', lp.execute_role,
            'is_active', lp.is_active,
            'created_by', lp.created_by,
            'created_dttm', lp.created_dttm,
            'updated_by', lp.updated_by,
            'updated_dttm', lp.updated_dttm
        )
    ) AS result
FROM 
    config.lnk_user_project AS lp
    INNER JOIN config.tbl_user AS u ON lp.user_id = u.id
    INNER JOIN config.tbl_project AS p ON lp.project_id = p.id
    INNER JOIN config.tbl_program AS pr ON lp.program_id = pr.id`;
    Promise.all([
      db.sequelizeConfig.query(columnQuery, { type: db.sequelizeConfig.QueryTypes.SELECT }),
      db.sequelizeConfig.query(rowQuery, { type: db.sequelizeConfig.QueryTypes.SELECT })
    ])
    .then(([columns, rows]) => {
      if (rows.length === 0) {
        res.send({ columns: [], rows: [] });
        return;
      }
      
      const columnHeaders = Object.keys(columns[0]).map((key) => ({
        field: key,
        type: key === 'read_role' || key === 'write_role' ||  key === 'execute_role' ? 'boolean' : 'string',
        editable: true
      }));
      
    const rowValues = rows.map(row => {
        const newRow = {};
        Object.keys(row).forEach(key => {
          newRow[key] = row[key];
        });
        return newRow;
      });
      
      res.send({ columns: columnHeaders, rows: rowValues });
    })
    .catch((err) => {
      console.error('Error querying database:', err);
      res.sendStatus(500);
    });
  };
  
  exports.getIdandName = (req, res) => {
    db.sequelizeConfig.query(
            `SELECT
            JSON_OBJECT(
              'programs', (
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'id', id,
                    'name', program_name
                  )
                )
                FROM config.tbl_program
              ),
              'projects', (
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'id', id,
                    'name', project_name
                  )
                )
                FROM config.tbl_project
              ),
              'users', (
                SELECT JSON_ARRAYAGG(
                  JSON_OBJECT(
                    'id', id,
                    'name', login_id
                  )
                )
                FROM config.tbl_user
              )
            ) as result;          
          `
        , 
            {model: User,Project,Program})
    .then(data => {
        logger.info("retrieving all the details",{exportFunction: "lnkuserproject.controller.getidandname"});
        res.send(data);
    })
    .catch(err => {
        console.log(err)
        logger.error("error occurred while retrieving the details",{exportFunction: "lnkuserproject.controller.getidandname"});
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving details."
        });
    });
};

// Find a single LnkUserProject with an id
exports.findOne = (req, res) => {
    const id = req.params.id;

    LnkUserProject.findByPk(id)
    .then(data => {
        if (data) {
        res.send(data);
        } else {
            res.status(404).send({
                message: `Cannot find LnkUserProject with id=${id}.`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error retrieving LnkUserProject with id=" + id
        });
    });
};

// Update a LnkUserProject by the id in the request
exports.update = (req, res) => {
    const id = req.params.id;
    LnkUserProject.update(req.body, {
        where: {id : id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "LnkUserProject was updated scuccessfully."
            });
        } else {
            res.send({
                message: `Cannot update LnkUserProject with id=${id}. Maybe LnkUserProject was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        console.log(err);
        res.status(500).send({
            message: "Error updating LnkUserProject with id=" + id
        });
    });
};

// Delete a LnkUserProject with the specified id in the request
exports.delete = (req, res) => {
    const id = req.params.id;
    LnkUserProject.update({is_active : "N"}, {
      where: {id : id,
    is_active: 'N' }
    })
    .then(num => {
      if (num == 1) {
          res.send({
              message: "LnkUserProject was soft delete scuccessfully."
          });
      } else {
          res.send({
              message: `Cannot soft delete LnkUserProject with id=${id}. Maybe LnkUserProject was not found or req.body is empty!`
          });
      }
    })
    .catch(err => {
      res.status(500).send({
          message: "Error soft deleting LnkUserProject with id=" + id
        });
    });
};

// Find all LnkUserProject
exports.findAllActive = (req, res) => {
    LnkUserProject.findAll({ where: {is_active: "Y"} })
    .then(data => {
        res.send(data);
    })
    .catch(err => {
        res.status(500).send({
            message:
            err.message || "Some error occurred while retrieving active LnkUserProject."
        });
    });
};