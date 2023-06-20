const db = require("../../models");
const Task_parameter = db.configModels.tbl_task_parameter;
const TaskParameters = db.configModels.tbl_task_parameter;
const task = db.configModels.tbl_task;
const Op = db.Sequelize.Op;
const logger = require("../../config/logger");

exports.create = async (req, res) => {

  let transaction;
  const { details } = req.body;

  try {
    const detailsRecords =
      details &&
      details.map((item) => {
        return {
          ...item,
          // task_id: data.id,
          is_active: "Y",
          created_by: "admin",
          updated_by: "admin",
        };
      });

    console.log("detailRecords: ", detailsRecords);
    const result = await TaskParameters.bulkCreate(detailsRecords, {
      transaction: transaction,
    });

    console.log("BulkInsert Result: ", result);

    await transaction.commit();

    res.send(req.body);
    logger.info("task created", {
      exportFunction: "task_parameter.controller.create",
    });
  } catch (error) {
    logger.error("error occurred while creating the task", {
      exportFunction: "task_parameter.controller.create",
    });
 // await transaction.rollback();   
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Task Record.",
    });
  }
};

exports.update = async (req, res) => {
  const taskId = req.params.task_id;
  console.log(taskId,"task ID");
  let transaction;
  const { details } = req.body;

    console.log(details,"DETAILS");
  try {
    transaction = await db.sequelizeConfig.transaction();
    
    await TaskParameters.destroy(
      { where: { task_id: taskId , task_type: "DataQuality", } },
      {
        transaction: transaction,
      }
    );
    const detailsRecords =
      details &&
      details.map((item) => {
        return {
          ...item,
          task_id: taskId,
          is_active: "Y",
          created_by: "admin",
          updated_by: "admin",
        };
      });

    console.log("detailRecords: ", detailsRecords);
    const result = await TaskParameters.bulkCreate(detailsRecords, {
      transaction: transaction,
    });
    console.log("BulkInsert Result: ", result);
    await transaction.commit();

    res.send({
      message: " Task updated scuccessfully.",
    });
    logger.info("Task was updated successfully", {
      exportFunction: "task.controller.update",
    });
  } catch (error) {
    logger.error("error while updating the task", {
      exportFunction: "task.controller.update",
    });
    // await transaction.rollback();
    res.status(500).send({
      message: error.message || "Error updating Connection with id=" + connId,
    });
  }
};


exports.createSQL = async (req, res) => {

  let transaction;
  const { details } = req.body;

  try {
    const detailsRecords =
      details &&
      details.map((item) => {
        return {
          ...item,
          // task_id: data.id,
          is_active: "Y",
          created_by: "admin",
          updated_by: "admin",
        };
      });

    console.log("detailRecords: ", detailsRecords);
    const result = await TaskParameters.bulkCreate(detailsRecords, {
      transaction: transaction,
    });

    console.log("BulkInsert Result: ", result);

    await transaction.commit();

    res.send(req.body);
    logger.info("task created", {
      exportFunction: "task_parameter.controller.create",
    });
  } catch (error) {
    logger.error("error occurred while creating the task", {
      exportFunction: "task_parameter.controller.create",
    });
 // await transaction.rollback();   
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Task Record.",
    });
  }
};

exports.updateSQL = async (req, res) => {
  const taskId = req.params.task_id;
  console.log(taskId,"task ID");
  let transaction;
  const { details } = req.body;

    console.log(details,"DETAILS");
  try {
    transaction = await db.sequelizeConfig.transaction();
    
    await TaskParameters.destroy(
      { where: { task_id: taskId , task_type: "SqlExecution", } },
      {
        transaction: transaction,
      }
    );
    const detailsRecords =
      details &&
      details.map((item) => {
        return {
          ...item,
          task_id: taskId,
          is_active: "Y",
          created_by: "admin",
          updated_by: "admin",
        };
      });

    console.log("detailRecords: ", detailsRecords);
    const result = await TaskParameters.bulkCreate(detailsRecords, {
      transaction: transaction,
    });
    console.log("BulkInsert Result: ", result);
    await transaction.commit();

    res.send({
      message: " Task updated scuccessfully.",
    });
    logger.info("Task was updated successfully", {
      exportFunction: "task.controller.update",
    });
  } catch (error) {
    logger.error("error while updating the task", {
      exportFunction: "task.controller.update",
    });
    // await transaction.rollback();
    res.status(500).send({
      message: error.message || "Error updating Connection with id=" + connId,
    });
  }
};

// Reterive all task_parameter from the database.
exports.findAll = (req, res) => {
  const id = parseInt(req.query.id);
  const condition = id ? { id: { [Op.eq]: id } } : null;
  console.log("Condition: ", condition);
  let sql = "";

  if (condition) {
    sql = `SELECT project_id,task_id,connection_id,task_type,parameter_type,key_01 as field_id,value_01 FROM tbl_task_parameter WHERE id = ${id}`;
  } else {
    sql = `SELECT * FROM tbl_task_parameter`;
  }
  /* Project.findAll(
        { attributes: ["id","program_id","project_name","project_description","project_manager","project_lead","is_active"]},
        { where: condition }) */
  db.sequelizeConfig
    .query(sql, { model: Task_parameter })
    .then((data) => {
      logger.info("retrieving all the task_parameters", {
        exportFunction: "task_parameter.controller.findAll",
      });
      res.send(data);
    })

    .catch((err) => {
      logger.error("error occurred while retrieving the task_parameters", {
        exportFunction: "task_parameter.controller.findAll",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving task_parameter.",
      });
    });
};

// To select distinct taskType
exports.findAllTasktype = (req, res) => {
  const id = parseInt(req.query.id);
  const condition = id ? { id: { [Op.eq]: id } } : null;
  console.log("Condition: ", condition);
  let sql = "";

  if (condition) {
    sql = `SELECT distinct task_type FROM config.tbl_task_parameter`;
  } else {
    sql = `SELECT distinct task_type FROM tbl_task_parameter`;
  }
  db.sequelizeConfig
    .query(sql, { model: Task_parameter })
    .then((data) => {
      logger.info("finding all the task types", {
        exportFunction: "task_parameter.controller.findAllTaskTypes",
      });
      res.send(data);
    })

    .catch((err) => {
      logger.error("error finding all the task types", {
        exportFunction: "task_parameter.controller.findAllTaskTypes",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving task_parameter.",
      });
    });
};

exports.findAllDQ = (req, res) => {
  const task_id = req.params.task_id;

  let sql = `SELECT * FROM config.tbl_task_parameter where task_id = ${task_id} and task_type = "DataQuality"`;

  db.sequelizeConfig
    .query(sql, { model: Task_parameter })
    .then((data) => {
      res.send({ data, fields: Task_parameter });
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send({
        message: "Task_parameter was not fetched scuccessfully.",
      });
    });
};

exports.findAllSqlExecution = (req, res) => {
  const task_id = req.params.task_id;
  let sql = `SELECT * FROM config.tbl_task_parameter where task_id = ${task_id} and task_type = "SqlExecution"`;
  db.sequelizeConfig
    .query(sql, { model: Task_parameter })
    .then((data) => {
      res.send({ data, fields: Task_parameter });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: "Task_parameter was not fetched scuccessfully.",
      });
    });
};

//  To get all Task_parameters with Task_id and Task_type
exports.findAll1 = (req, res) => {
  const task_id = req.params.task_id;
  const task_type = req.params.task_type;

  const condition = task_id && task_type ? true : false;

  console.log("Condition: ", condition);
  let sql = "";

  if (condition) {
    sql = `SELECT project_id,task_id,connection_id,task_type,parameter_type,key_01 as field_id,value_01 FROM tbl_task_parameter WHERE task_id = ${task_id} and task_type="${task_type}"`;
  } else {
    sql = `SELECT * FROM tbl_task_parameter`;
  }
  db.sequelizeConfig
    .query(sql, { model: Task_parameter })
    .then((data) => {
      res.send({ data, fields: Task_parameter });
    })

    .catch((err) => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving task_parameter.",
      });
    });
};

// Find a single Task_parameter with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Task_parameter.findByPk(id)
    .then((data) => {
      if (data) {
        logger.info("finding the task_parameter by id", {
          exportFunction: "task_parameter.controller.findOne",
        });
        res.send(data);
      } else {
        logger.info("cannot find task_parameter by id", {
          exportFunction: "task_parameter.controller.findOne",
        });
        res.status(404).send({
          message: `Cannot find Task with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      logger.error("error retrieving task_parameter with id", {
        exportFunction: "task_parameter.controller.findOne",
      });
      res.status(500).send({
        message: "Error retrieving Task with id=" + id,
      });
    });
};

// Find all published Task_parameters
exports.findAllActive = (req, res) => {
  Task_parameter.findAll({ where: { is_active: "Y" } })
    .then((data) => {
      res.send(data);
      logger.info("finding all the active task_parameters", {
        exportFunction: "task_parameter.controller.findAllActive",
      });
    })
    .catch((err) => {
      logger.error("error occurred while retrieving active task_parameters", {
        exportFunction: "task_parameter.controller.findAllActive",
      });
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving active Task_parameters.",
      });
    });
};
exports.getcount = (req, res) => {
  Task_parameter.findAndCountAll({
    where: {
      is_active: "Y",
    },
  })

    .then((data) => {
      res.send(data);
      logger.info("getting the count of the active task_paramter", {
        exportFunction: "task_parameter.controller.getCount",
      });
    })
    .catch((err) => {
      logger.error("error getting the count of the active task_paramter", {
        exportFunction: "task_parameter.controller.getCount",
      });
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving Task_parameters.",
      });
    });
};
// Delete a Task_parameters with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Task_parameter.update(
    { is_active: "N" },
    {
      where: { id: id, is_active: "N" },
    }
  )
    .then((num) => {
      if (num == 1) {
        logger.info("task_parameter was soft deleted successfully", {
          exportFunction: "task_parameter.controller.delete",
        });
        res.send({
          message: "Task_parameter was soft delete scuccessfully.",
        });
      } else {
        logger.info("cannot soft delete the task_parameter", {
          exportFunction: "task_parameter.controller.delete",
        });
        res.send({
          message: `Cannot soft delete Task_parameter with id=${id}. Maybe Task_parameter was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.error("error soft deleting the task_parameter", {
        exportFunction: "task_parameter.controller.delete",
      });
      res.status(500).send({
        message: "Error soft deleting Task_parameter with id=" + id,
      });
    });
};

// // Update a Task by the id in the request
// exports.update = (req, res) => {
//   const task_id = req.params.task_id;
//   Task_parameter.update(req.body, {
//     where: { task_id: task_id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         logger.info("task_paramter was updated successfully", {
//           exportFunction: "task_paramter.controller.update",
//         });
//         res.send({
//           message: "Task Task_parameter updated scuccessfully.",
//         });
//       } else {
//         logger.info("Cannot update task_parameter", {
//           exportFunction: "task_parameter.controller.update",
//         });
//         res.send({
//           message: `Cannot update Task_parameter with task_id=${task_id}. Maybe Task_parameter was not found or req.body is empty!`,
//         });
//       }
//     })
//     .catch((err) => {
//       logger.error("error while updating the task_parameter", {
//         exportFunction: "task_parameter.controller.update",
//       });
//       res.status(500).send({
//         message: "Error updating Task_parameter with task_id=" + task_id,
//       });
//     });
// };

exports.findProject = (req, res) => {
  const project_id = parseInt(req.query.project_id);
  const condition = project_id ? { project_id: { [Op.eq]: project_id } } : null;
  console.log("Condition: ", condition);
  let sql = "";
  if (condition) {
    sql = `SELECT * FROM tbl_task_parameter WHERE project_id =${id}`;
  } else {
    sql = `SELECT * FROM tbl_task_parameter`;
  }

  db.sequelizeConfig
    .query(sql, { model: Task_parameter })
    .then((data) => {
      logger.info("finding the project with project_id", {
        exportFunction: "pipeline.controller.findProject",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error finding the project with project_id", {
        exportFunction: "pipeline.controller.findProject",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving task_parameter.",
      });
    });
};

//  To get all source fields

exports.findAllfieldsSource = (req, res) => {
  const connection_subtype = req.params.connection_subtype;
  const connection_name = req.params.connection_name;

  const condition = connection_subtype && connection_name ? true : false;

  console.log("Condition: ", condition);
  let sql = "";

  if (condition) {
    // sql = `SELECT * FROM config.vw_task_parametersource where  connection_subtype="${connection_subtype}" and connection_name= "${connection_name}"`
    sql = `SELECT * FROM config.vw_tasks where  connection_subtype="${connection_subtype}" and connection_name= "${connection_name}"`;
  } else {
    sql = `select sec, connection_subtype, connection_name,field_id, display_name, field_type, case when field_type = 'select' then listvalue else null end as value
        from (
        select sec, connection_subtype, connection_name, field_id,display_name, field_type, JSON_ARRAYAGG(JSON_OBJECT('value_01', value_01)) as listvalue
        from config.vw_task1
        where display_sequence != 0 
        group by sec, connection_subtype, connection_name, display_name, field_type
        order by sec, connection_subtype) tmp where sec="Source"  `;
  }

  db.sequelizeConfig
    .query(sql, { model: Task_parameter })
    .then((data) => {
      Task_parameter.findByPk(connection_subtype & connection_name);
      res.send({ data, fields: Task_parameter });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Project.",
      });
    });
};

//  To get all Target fields
exports.findAllfieldsTarget = (req, res) => {
  const connection_subtype = req.params.connection_subtype;
  const connection_name = req.params.connection_name;

  const condition = connection_subtype && connection_name ? true : false;

  console.log("Condition: ", condition);
  let sql = "";

  if (condition) {
    // sql = `SELECT * FROM config.vw_task_target where  connection_subtype="${connection_subtype}" and connection_name= "${connection_name}"`
    sql = `SELECT * FROM config.vw_taskt where  connection_subtype="${connection_subtype}" and connection_name= "${connection_name}"`;
  } else {
    sql = `select sec, connection_subtype, connection_name,field_id, display_name, field_type, case when field_type = 'select' then listvalue else null end as value
    from (
    select sec, connection_subtype, connection_name, field_id,display_name, field_type, JSON_ARRAYAGG(JSON_OBJECT('value_01', value_01)) as listvalue
    from config.vw_task1
    where display_sequence != 0 
    group by sec, connection_subtype, connection_name, display_name, field_type
    order by sec, connection_subtype) tmp where sec="Target"  `;
  }

  db.sequelizeConfig
    .query(sql, { model: Task_parameter })
    .then((data) => {
      Task_parameter.findByPk(connection_subtype & connection_name);
      res.send({ data, fields: Task_parameter });
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Project.",
      });
    });
};

exports.findObjectWithId = (req, res) => {
  const task_id = parseInt(req.query.task_id);

  db.sequelizeConfig
    .query(
      `SELECT id, key_01, value_01 FROM tbl_task_parameter WHERE task_id = ${task_id}`,
      { model: Task_parameter }
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

// To delete and reinsert records
exports.delete2 = (req, res) => {
  const task_id = req.params.task_id;
  const task_type = req.params.task_type;

  let sql = `delete  FROM config.tbl_task_parameter WHERE task_id = ${task_id} and task_type="${task_type}"`;

  db.sequelizeConfig
    .query(sql, { model: Task_parameter })
    .then((message) => {
      res.send({
        message: "Task_parameter was  deleted scuccessfully.",
      });
    })
    .catch((err) => {
      res.status(500).send({
        message: "Task_parameter was not deleted scuccessfully.",
      });
    });
};
