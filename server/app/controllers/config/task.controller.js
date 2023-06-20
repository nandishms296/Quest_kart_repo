const db = require("../../models");
const Task = db.configModels.tbl_task;
const TaskParameters = db.configModels.tbl_task_parameter;
const Connection = db.configModels.tbl_connection;
const TaskList = db.configModels.vw_task_list;
const VwTask1 = db.configModels.vw_task_list;
const Op = db.Sequelize.Op;
const logger = require("../../config/logger");
const { uploadFileToGitHub } = require("../../config/github");

exports.create = async (req, res) => {
  // validate request
  /*   if (!req.body.task_name) {
    res.status(400).send({
      message: "Content can't be empty!.",
    });
    return;
  } */

  let transaction;
  const { details, ...tblTask } = req.body;

  //Create a Task.
  const taskRecord = {
    ...tblTask,
    created_by: "admin",
    updated_by: "admin",
  };

  try {
    transaction = await db.sequelizeConfig.transaction();
    const data = await Task.create(taskRecord, {
      transaction: transaction,
    });
    //  Now loop thru the details to insert record into ConnectionDetails table.

    if (!details) {
      await transaction.commit();
      res.send(req.body);
      return;
    }
    const detailsRecords =
      details &&
      details.map((item) => {
        return {
          ...item,
          task_id: data.id,
          is_active: "Y",
          created_by: "admin",
          updated_by: "admin",
        };
      });

    // console.log("detailRecords: ", detailsRecords);
    const result = await TaskParameters.bulkCreate(detailsRecords, {
      transaction: transaction,
    });

    // console.log("BulkInsert Result: ", result);

    await transaction.commit();

    // const resultObjSource = {};
    // const resultObjTarget = {};
    // const resultObjDataQuality = {
    //   parameters: {},
    // };
    // for (const item of result) {
    //   // console.log("-----------------------------------------------",item,"--------------------------------------------------------");
    //   if (item.task_type === "Source") {
    //     resultObjSource[item.key_01] = item.value_01;

    //     resultObjSource.source_type = `${item.parameter_type.toLowerCase()}_read`; // update parameter_type to source_type

    //     // Get the source connection name from the Connection table
        // const sourceConnection = await Connection.findByPk(
        //   resultObjSource.connection_name
        // ); // pass the connection name
        // if (sourceConnection) {
        //   resultObjSource.connection_name = sourceConnection.connection_name;
        // }
    //     // Remove the "" from chunk_size
    //     if (item.key_01 === "chunk_size") {
    //       resultObjSource.chunk_size = parseInt(item.value_01);
    //     }
    //   } else if (item.task_type === "Target") {
    //     resultObjTarget[item.key_01] = item.value_01;

    //     resultObjTarget.target_type = `${item.parameter_type.toLowerCase()}_write`; // update parameter_type to target_type

    //     // Get the target connection name from the Connection table
    //     const targetConnection = await Connection.findByPk(
    //       resultObjTarget.connection_name
    //     ); // pass the connection name
    //     if (targetConnection) {
    //       resultObjTarget.connection_name = targetConnection.connection_name;
    //     }
    //   } else if (item.task_type === "DataQuality") {
    //     resultObjDataQuality[item.key_01] = item.value_01;
    //   }
    // }

    // delete resultObjSource.parameter_type; // delete the "parameter_type" property from resultObjSource
    // delete resultObjTarget.parameter_type; // delete the "parameter_type" property from resultObjTarget
    // delete resultObjDataQuality.id;
    // delete resultObjDataQuality.project_name;
    // delete resultObjDataQuality.pipeline_name;
    // delete resultObjDataQuality.source;
    // delete resultObjDataQuality.target;
    // delete resultObjDataQuality.is_active;

    // // Combine taskRecord and result and convert to JSON

    const combinedData = {
      ...tblTask,
      // task: {
      //   source: resultObjSource,
      //   target: resultObjTarget,
      //   data_quality_execution: {
      //     pre_check_enable: "N",
      //     post_check_enable: "N",
      //   },
      //   data_quality_features: {
      //     dq_auto_correction_required: "N",
      //     dq_auto_correct_columns: { county: "county_nm", state: "stt" },
      //     dq_lkup_key_column: { zip: "zip_code" },
      //     dq_lookup_file_path:
      //       "C:/Users/PuneethS/Desktop/county_city_zip_lookup.csv",
      //     data_masking_required: "N",
      //     data_masking_columns: {
      //       msk_date: "0,DateOfBirth",
      //       msk_alpha: "x,PersonalEmail,IBAN",
      //       msk_numeric: "*,BSNNumber,account_no",
      //     },
      //     data_encryption_required: "N",
      //     data_decryption_required: "N",
      //     data_encryption_columns: "LastName, IBAN, PersonalEmail",
      //     data_decryption_columns: "LastName, PersonalEmail",
      //   },
      //   data_quality: [],
      // },
    };

    // If the resultObjDataQuality object contains values check, active, ignore_bad_records, threshold_bad_records, and type, create an array with those properties
    // if (
    //   resultObjDataQuality.check &&
    //   resultObjDataQuality.active &&
    //   resultObjDataQuality.ignore_bad_records &&
    //   resultObjDataQuality.threshold_bad_records &&
    //   resultObjDataQuality.type
    // ) {
    //   combinedData.task.data_quality.push({
    //     check: resultObjDataQuality.check,
    //     active: resultObjDataQuality.active,
    //     ignore_bad_records: resultObjDataQuality.ignore_bad_records,
    //     threshold_bad_records: resultObjDataQuality.threshold_bad_records,
    //     type: resultObjDataQuality.type,
    //     parameters: resultObjDataQuality,
    //   });
    // } else {
    //   // If the resultObjDataQuality object does not contain all required properties, add all its properties to the data_quality array as objects with name and value properties
    //   for (const [name, value] of Object.entries(resultObjDataQuality)) {
    //     combinedData.task.data_quality.push({ name, value });
    //   }
    // }

    // for (const quality of combinedData.task.data_quality) {
    //   const parameters = quality.parameters;
    //   if (parameters) {
    //     combinedData.task.data_quality_execution = {
    //       post_check_Execution: parameters.post_check_Execution,
    //       pre_check_Execution: parameters.pre_check_Execution,
    //     };
    //   }
    // }

    // for (const quality of combinedData.task.data_quality) {
    //   const parameters = quality.parameters;
    //   if (parameters) {
    //     delete parameters.parameters;
    //     delete parameters.check;
    //     delete parameters.active;
    //     delete parameters.ignore_bad_records;
    //     delete parameters.threshold_bad_records;
    //     delete parameters.type;
    //     delete parameters.post_check_Execution;
    //     delete parameters.pre_check_Execution;
    //   }
    // }

    // if (combinedData.task.source.source_type === "local server_read") {
    //   combinedData.task.source.source_type =
    //     combinedData.task.source.file_type + "_read";
    // }
    // if (combinedData.task.target.target_type === "local server_write") {
    //   combinedData.task.target.target_type =
    //     combinedData.task.target.file_type + "_write";
    // }

    const jsonData = JSON.stringify(combinedData, null, 2);

    // Upload file to GitHub
    const fileName = `program/ingestion_kart/task/${tblTask.task_name}.json`;
    const message = `created task ${tblTask.task_name}`;
    const operationType = "create";
    await uploadFileToGitHub(fileName, jsonData, message, operationType);

    res.send(req.body);
    logger.info("task created", {
      exportFunction: "task.controller.create",
    });
  } catch (error) {
    logger.error("error occurred while creating the task", {
      exportFunction: "task.controller.create",
    });
 // await transaction.rollback();   
    res.status(500).send({
      message:
        error.message || "Some error occurred while creating the Task Record.",
    });
  }
};

// Update a Pipeline by the id in the request
exports.update = async (req, res) => {
  const taskId = req.params.id;

  let transaction;
  const { details, ...tblTask } = req.body;

  //Create a Task.
  const taskRecord = {
    ...tblTask,
    is_active: "Y",
    created_by: "admin",
    updated_by: "admin",
  };

  try {
    transaction = await db.sequelizeConfig.transaction();
    await Task.update(
      taskRecord,
      { where: { id: taskId } },
      {
        transaction: transaction,
      }
    );
    // await TaskParameters.destroy(
    //   { where: { task_id: taskId } },
    //   {
    //     transaction: transaction,
    //   }
    // );
    await TaskParameters.destroy(
      {
        where: {
          task_id: taskId,
          task_type: "Source",
        },
        transaction: transaction,
      }
    );
    await TaskParameters.destroy(
      {
        where: {
          task_id: taskId,
          task_type: "Target",
        },
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

    

    const combinedData = {
      ...tblTask,
     
    };

   
    const jsonData = JSON.stringify(combinedData, null, 2);

    // Upload file to GitHub
    const fileName = `program/ingestion_kart/task/${tblTask.task_name}.json`;
    const message = `updated task ${tblTask.task_name}`;
    const operationType = "update";
    await uploadFileToGitHub(fileName, jsonData, message, operationType);

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


exports.updateTask = (req, res) => {
  const id = req.params.id;
  Task.update(req.body, {
      where: {id : id }
  })
  .then(num => {
      if (num == 1) {
          res.send({
              message: "task was updated scuccessfully."
          });
      } else {
          res.send({
              message: `Cannot update task with id=${id}. Maybe LnkUserProject was not found or req.body is empty!`
          });
      }
  })
  .catch(err => {
      console.log(err);
      res.status(500).send({
          message: "Error updating task with id=" + id
      });
  });
};


exports.getTaskInfo = async (req, res) => {
  const id = parseInt(req.params.id);
  const sqlTask = `SELECT id, task_name, task_description, task_type, task_sequence, is_active FROM tbl_task WHERE id = ${id}`;
  const sqlTaskParamters = `SELECT * from vw_task1`;

  try {
    let task = await db.sequelizeConfig.query(sqlTask, { model: Task });
    const parameters = await db.sequelizeConfig.query(sqlTaskParamters, {
      model: VwTask1,
    });
    const data = {
      ...task,
      parameters,
    };
    res.send(data);
    logger.info("Retrieving the task info", {
      exportFunction: "task.controller.getTaskInfo",
    });
  } catch (error) {
    logger.error("error while retrieving the task info", {
      exportFunction: "task.controller.getTaskInfo",
    });
    res.status(500).send({
      message: error.message || "Some error occurred while creating the Task.",
    });
  }
};

// exports.updateTask = (req, res) => {
//   const id = req.params.id;
//   Task.update(req.body, {
//     where: { id: id },
//   })
//     .then((num) => {
//       if (num == 1) {
//         res.send({
//           message: "task was updated scuccessfully.",
//         });
//       } else {
//         res.send({
//           message: `Cannot update task with id=${id}. Maybe LnkUserProject was not found or req.body is empty!`,
//         });
//       }
//     })
//     .catch((err) => {
//       console.log(err);
//       res.status(500).send({
//         message: "Error updating task with id=" + id,
//       });
//     });
// };

exports.findALLTasksForPipelineID = async (req, res) => {
  const pipeline_id = parseInt(req.params.id);
  let sql = "";
  if (pipeline_id) {
    sql = `with dq_count as (select task_id, count(parameter_type) as dqcount from (
      select distinct task_id, task_type, parameter_type from  config.tbl_task_parameter where task_type ='DataQuality') ttp group by task_id
      )
    select id, project_name, pipeline_id, pipeline_name, task_name, task_description, 
                 task_type, task_sequence, source, target, COALESCE(dqcount,0) as dqcount, is_active, details
               from config.vw_task_list vtl left outer join dq_count dc on vtl.id = dc.task_id
           where pipeline_id = ${pipeline_id}`;
  } else {
    sql = `with dq_count as (select task_id, count(parameter_type) as dqcount from (
      select distinct task_id, task_type, parameter_type from  config.tbl_task_parameter where task_type ='DataQuality') ttp group by task_id
      )
    select id, project_name, pipeline_id, pipeline_name, task_name, task_description, 
                 task_type, task_sequence, source, target, COALESCE(dqcount,0) as dqcount, is_active, details
               from config.vw_task_list vtl left outer join dq_count dc on vtl.id = dc.task_id`;
  }
  try {
    const tasks = await db.sequelizeConfig.query(sql, { model: TaskList });
    res.status(200).json(tasks);
    logger.info("Retrieving the task for pipeline ID ", {
      exportFunction: "task.controller.findALLTasksForPipelineID",
    });
  } catch (err) {
    logger.error("error while retrieving the task for pipeline ID ", {
      exportFunction: "task.controller.findALLTasksForPipelineID",
    });
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Task.",
    });
  }
};

// Reterive all tasks from the database.
exports.findAll = async (req, res) => {
  const pipeline_id = parseInt(req.params.id);
  let sql = "";
  if (pipeline_id) {
    sql = `select id, project_name, pipeline_id, pipeline_name, task_name, task_description, 
             task_type, task_sequence, source, target, is_active, details
           from config.vw_task_list
           where pipeline_id = ${pipeline_id}`;
  } else {
    sql = `select id, project_name, pipeline_id, pipeline_name, task_name, task_description, 
             task_type, task_sequence, source, target, is_active, details
           from config.vw_task_list`;
  }
  try {
    const tasks = await db.sequelizeConfig.query(sql, { model: TaskList });
    res.status(200).json(tasks);
    logger.info("Retrieving the task for pipeline ID ", {
      exportFunction: "task.controller.findAll",
    });
  } catch (err) {
    logger.error("error while retrieving the task for pipeline ID ", {
      exportFunction: "task.controller.findAll",
    });
    res.status(500).send({
      message: err.message || "Some error occurred while retrieving Task.",
    });
  }
};

// Find a single Task with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Task.findByPk(id)
    .then((data) => {
      if (data) {
        logger.info("finding the task by id", {
          exportFunction: "task.controller.findOne",
        });
        res.send(data);
      } else {
        logger.info("cannot find task by id", {
          exportFunction: "task.controller.findOne",
        });
        res.status(404).send({
          message: `Cannot find Task with id=${id}.`,
        });
      }
    })
    .catch((err) => {
      logger.error("error retrieving task with id", {
        exportFunction: "task.controller.findOne",
      });
      res.status(500).send({
        message: "Error retrieving Task with id=" + id,
      });
    });
};

// Delete a Task with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  Task.update(
    { is_active: "N" },
    {
      where: { id: id, is_active: "N" },
    }
  )
    .then((num) => {
      if (num == 1) {
        logger.info("task was soft deleted successfully", {
          exportFunction: "task.controller.delete",
        });
        res.send({
          message: "Task was soft delete scuccessfully.",
        });
      } else {
        logger.info("cannot soft delete the task", {
          exportFunction: "task.controller.delete",
        });
        res.send({
          message: `Cannot soft delete Task with id=${id}. Maybe Task was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.error("error soft deleting the task", {
        exportFunction: "task.controller.delete",
      });
      res.status(500).send({
        message: "Error soft deleting Task with id=" + id,
      });
    });
};

// Find all published Task
exports.findAllActive = (req, res) => {
  Task.findAll({ where: { is_active: "Y" } })
    .then((data) => {
      logger.info("finding all the active task", {
        exportFunction: "task.controller.findAllActive",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error occurred while retrieving active task", {
        exportFunction: "task.controller.findAllActive",
      });
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving active Task.",
      });
    });
};

exports.getCount = (req, res) => {
  Task.findAndCountAll({
    where: {
      is_active: "Y",
    },
  })
    .then((data) => {
      logger.info("getting count task", {
        exportFunction: "task.controller.getCount",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error occurred while getting count task", {
        exportFunction: "task.controller.getCount",
      });
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Tasks.",
      });
    });
};

exports.getSort1 = (req, res) => {
  Task.findAll(
    {
      attributes: [
        "id",
        "task_name",
        "task_description",
        "task_type",
        "task_sequence",
        "is_active",
      ],
    },

    {
      order: [["id", "ASC"]],
    }
  )

    .then((data) => {
      logger.info("sorting the tasks by ID", {
        exportFunction: "task.controller.getSort1",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error while sorting the tasks by ID", {
        exportFunction: "task.controller.getSort1",
      });
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Task.",
      });
    });
};

exports.getSort2 = (req, res) => {
  Task.findAll({
    attributes: [
      "id",
      "task_name",
      "task_description",
      "task_type",
      "task_sequence",
      "is_active",
    ],
    order: [["id", "DESC"]],
  })

    .then((data) => {
      logger.info("sorting the tasks by ID", {
        exportFunction: "task.controller.getSort2",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error while sorting the tasks by ID", {
        exportFunction: "task.controller.getSort2",
      });
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Task.",
      });
    });
};

exports.findObjectId = (req, res) => {
  const id = parseInt(req.query.id);

  db.sequelizeConfig
    .query(`SELECT id, task_name WHERE id = ${id}`, { model: Connection })
    .then((data) => {
      console.log("Result of Query: ", data);
      res.send(data);
      logger.info("find object by ID of task", {
        exportFunction: "task.controller.findObjectId",
      });
    })
    .catch((err) => {
      logger.error("error while finding object by ID of task", {
        exportFunction: "task.controller.findObjectId",
      });
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Tasks.",
      });
    });
};
exports.getGitData = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await db.sequelizeConfig.query(`SELECT * FROM vw_task_list WHERE id = ${id}`, { model: TaskList })
    const item = data[0];
    let modifiedData = {
      task_id: item.id,
      pipeline_id: item.dataValues.pipeline_id,
      task_name: item.task_name,
      task_type: item.task_type,
      sql_execution: {},
      sql_list: [],
    };
    const { details, ...modifieditem } = item.dataValues;
    // data for source ,target ,DQ
    let modifiedData1 = {
      ...modifieditem,
      task: {},
    };
    if (item.details && item.details.SqlExecution) {
      const sqlExecution = item.details.SqlExecution;
      if (Array.isArray(sqlExecution)) {
        modifiedData.sql_execution = {
          connection_name: sqlExecution[0].parameters?.se_connection_name || '',
          restart: sqlExecution[0].parameters?.se_restart || '',
        };
        if (sqlExecution[0].SqlExecution && Array.isArray(sqlExecution[0].SqlExecution)) {
          modifiedData.sql_list = sqlExecution[0].SqlExecution.map((sql) => ({
            seq_no: parseInt(sql.se_sql_seq_no),
            sql_query: sql.se_sql_query,
          }));
        }
      } else {
        modifiedData.sql_execution = {
          connection_name: sqlExecution.parameters?.se_connection_name || '',
          restart: sqlExecution.parameters?.se_restart || '',
        };
        if (sqlExecution.SqlExecution && Array.isArray(sqlExecution.SqlExecution)) {
          modifiedData.sql_list = sqlExecution.SqlExecution.map((sql) => ({
            seq_no: parseInt(sql.se_sql_seq_no),
            sql_query: sql.se_sql_query,
            table_used_desc: sql.se_table_used_desc,
          }));
        }
      }

      const modifiedJsonData = JSON.stringify(modifiedData, null, 2);
      const fileName = `program/ingestion_kart/task/${data[0].task_name}.json`;

      uploadFileToGitHub(
        fileName,
        modifiedJsonData,
        "Update task data",
        "update"
      )
      res.send(modifiedData);
      logger.info("task data updated and pushed to GitHub", { exportFunction: "task.controller.updateGitData" });
    }
    else {
      if (item.details && item.details.Source) {
        const modifiedSource = {};
        modifiedSource["source_type"] = item.details.Source.src_parameter_type.toLowerCase().replace(/\s+/g, "_") + "_read";
        Object.keys(item.details.Source).forEach((key) => {
          modifiedSource[key.replace(/^src_/, "").toLowerCase()] = item.details.Source[key];
        });
        const sourceConnection = await Connection.findByPk(modifiedSource.connection_name); // pass the connection name
        if (sourceConnection) {
          modifiedSource.connection_name = sourceConnection.connection_name;
        }
        modifiedSource.chunk_size = parseInt(modifiedSource.chunk_size, 10);
        modifiedData1.task.source = modifiedSource;
      }

      if (item.details && item.details.Target) {
        const modifiedTarget = {};
        modifiedTarget["target_type"] = item.details.Target.tgt_parameter_type.toLowerCase().replace(/\s+/g, "_") + "_write";
        Object.keys(item.details.Target).forEach((key) => {
          modifiedTarget[key.replace(/^tgt_/, "").toLowerCase()] = item.details.Target[key];
        });
        const targetConnection = await Connection.findByPk(modifiedTarget.connection_name);
        if (targetConnection) {
          modifiedTarget.connection_name = targetConnection.connection_name;
          console.log(targetConnection.connection_name, "5555555555555555555")
        }
        modifiedData1.task.target = modifiedTarget;
      }
      if (item.details && item.details.DataQuality) {
        if (!Array.isArray(item.details.DataQuality)) {
          const newDataQuality = {
            pre_check_enable: item.details.DataQuality.parameters?.dq_pre_check === "1" ? "Y" : "N",
            post_check_enable: item.details.DataQuality.parameters?.dq_post_check === "1" ? "Y" : "N",
          };
          modifiedData1.task.data_quality_execution = newDataQuality;
        }
      }
      if (item.details && item.details.DataQuality) {
        if (!Array.isArray(item.details.DataQuality)) {
          const modifiedData = Array.isArray(item.details.DataQuality.DataQuality)
            ? item.details.DataQuality.DataQuality
            : [item.details.DataQuality.DataQuality];
          modifiedData1.task.data_quality = modifiedData.map((dq) => {
            const modifiedDq = {};
            Object.keys(dq).forEach((key) => {
              modifiedDq[key.replace(/^dq_/, "").toLowerCase()] = dq[key];
            });
            const newDataQuality = {
              seq_no: modifiedDq.idx,
              check: modifiedDq.check,
              parameters: {}, // Initialize parameters as an empty object
              active: modifiedDq.active === '1' ? 'Y' : 'N',
              ignore_bad_records: modifiedDq.ignore_bad_records === '1' ? 'Y' : 'N',
              threshold_bad_records: parseInt(modifiedDq.threshold_bad_records),
              type: modifiedDq.type
            };
            // Pass the remaining values from modifiedDq to parameters
            Object.keys(modifiedDq).forEach((key) => {
              if (!['idx', 'check', 'active', 'ignore_bad_records', 'threshold_bad_records', 'type'].includes(key)) {
                newDataQuality.parameters[key] = modifiedDq[key];
              }
            });
            return newDataQuality;
          });
        }
      }

      if (modifiedData1?.task?.source?.source_type === "local_server_read") {
        modifiedData1.task.source.source_type = modifiedData1.task.source.file_type + "_read";
      }
      if (modifiedData1?.task?.target?.target_type === "local_server_write") {
        modifiedData1.task.target.target_type = modifiedData1.task.target.file_type + "_write";
      }
      
      if (!modifiedData1?.task?.data_quality_execution) {
        modifiedData1.task.data_quality_execution = {
          "pre_check_enable": "N",
          "post_check_enable": "N"
        };
      }

      const modifiedJsonData = JSON.stringify(modifiedData1, null, 2);
      const fileName = `program/ingestion_kart/task/${data[0].task_name}.json`;
      uploadFileToGitHub(
        fileName,
        modifiedJsonData,
        "Updated task data",
        "update"
      )
        .then(() => {
          res.send(modifiedData1);
          logger.info("task data updated and pushed to GitHub", { exportFunction: "task.controller.updateGitData" });
        })
        .catch((err) => {
          console.log(err);
          logger.error("Error occurred while pushing JSON file to GitHub", { exportFunction: "task.controller.updateGitData" });
          res.status(500).send({
            message: err.message || "Some error occurred while updating the Task data.",
          });
        });
    }
  }
  catch (err) {
    console.log(err);
    logger.error("Error occurred while pushing JSON file to GitHub", { exportFunction: "task.controller.updateGitData" });
    res.status(500).send({
      message: err.message || "Some error occurred while updating the Task data.",
    });
  };
};


exports.GitDataUpdate = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await db.sequelizeConfig.query(`SELECT * FROM vw_task_list WHERE id = ${id}`, { model: TaskList })
    const item = data[0];
    let modifiedData = {
      task_id: item.id,
      pipeline_id: item.dataValues.pipeline_id,
      task_name: item.task_name,
      task_type: item.task_type,
      sql_execution: {},
      sql_list: [],
    };
    const { details, ...modifieditem } = item.dataValues;
    // data for source ,target ,DQ
    let modifiedData1 = {
      ...modifieditem,
      task: {},
    };
    if (item.details && item.details.SqlExecution) {
      const sqlExecution = item.details.SqlExecution;
      if (Array.isArray(sqlExecution)) {
        modifiedData.sql_execution = {
          connection_name: sqlExecution[0].parameters?.se_connection_name || '',
          restart: sqlExecution[0].parameters?.se_restart || '',
        };
        if (sqlExecution[0].SqlExecution && Array.isArray(sqlExecution[0].SqlExecution)) {
          modifiedData.sql_list = sqlExecution[0].SqlExecution.map((sql) => ({
            seq_no: parseInt(sql.se_sql_seq_no),
            sql_query: sql.se_sql_query,
          }));
        }
      } else {
        modifiedData.sql_execution = {
          connection_name: sqlExecution.parameters?.se_connection_name || '',
          restart: sqlExecution.parameters?.se_restart || '',
        };
        if (sqlExecution.SqlExecution && Array.isArray(sqlExecution.SqlExecution)) {
          modifiedData.sql_list = sqlExecution.SqlExecution.map((sql) => ({
            seq_no: parseInt(sql.se_sql_seq_no),
            sql_query: sql.se_sql_query,
            table_used_desc: sql.se_table_used_desc,
          }));
        }
      }

      const modifiedJsonData = JSON.stringify(modifiedData, null, 2);
      const fileName = `program/ingestion_kart/task/${data[0].task_name}.json`;

      uploadFileToGitHub(
        fileName,
        modifiedJsonData,
        "Update task data",
        "update"
      )
      res.send(modifiedData);
      logger.info("task data updated and pushed to GitHub", { exportFunction: "task.controller.updateGitData" });
    }
    else {
      if (item.details && item.details.Source) {
        const modifiedSource = {};
        modifiedSource["source_type"] = item.details.Source.src_parameter_type.toLowerCase().replace(/\s+/g, "_") + "_read";
        Object.keys(item.details.Source).forEach((key) => {
          modifiedSource[key.replace(/^src_/, "").toLowerCase()] = item.details.Source[key];
        });
        // console.log(modifiedSource.connection_name,"++++++++++++++++++++++++++++++++++++++++++++++++")
        const sourceConnection = await Connection.findByPk(modifiedSource.connection_name); // pass the connection name
        if (sourceConnection) {
          modifiedSource.connection_name = sourceConnection.connection_name;
          // console.log(sourceConnection.connection_name, "44444444444444444444444444444444444444444")
        }
        console.log(modifiedSource,"44444444444444444444444444444444444444444");
        modifiedSource.chunk_size = parseInt(modifiedSource.chunk_size, 10);
        modifiedData1.task.source = modifiedSource;
      }

      if (item.details && item.details.Target) {
        const modifiedTarget = {};
        modifiedTarget["target_type"] = item.details.Target.tgt_parameter_type.toLowerCase().replace(/\s+/g, "_") + "_write";
        Object.keys(item.details.Target).forEach((key) => {
          modifiedTarget[key.replace(/^tgt_/, "").toLowerCase()] = item.details.Target[key];
        });
        const targetConnection = await Connection.findByPk(modifiedTarget.connection_name);
        if (targetConnection) {
          modifiedTarget.connection_name = targetConnection.connection_name;
          console.log(targetConnection.connection_name, "5555555555555555555")
        }
        modifiedData1.task.target = modifiedTarget;
      }
      if (item.details && item.details.DataQuality) {
        if (!Array.isArray(item.details.DataQuality)) {
          const newDataQuality = {
            pre_check_enable: item.details.DataQuality.parameters?.dq_pre_check === "1" ? "Y" : "N",
            post_check_enable: item.details.DataQuality.parameters?.dq_post_check === "1" ? "Y" : "N",
          };
          modifiedData1.task.data_quality_execution = newDataQuality;
        }
      }
      if (item.details && item.details.DataQuality) {
        if (!Array.isArray(item.details.DataQuality)) {
          const modifiedData = Array.isArray(item.details.DataQuality.DataQuality)
            ? item.details.DataQuality.DataQuality
            : [item.details.DataQuality.DataQuality];
          modifiedData1.task.data_quality = modifiedData.map((dq) => {
            const modifiedDq = {};
            Object.keys(dq).forEach((key) => {
              modifiedDq[key.replace(/^dq_/, "").toLowerCase()] = dq[key];
            });
            const newDataQuality = {
              seq_no: modifiedDq.idx,
              check: modifiedDq.check,
              parameters: {}, // Initialize parameters as an empty object
              active: modifiedDq.active === '1' ? 'Y' : 'N',
              ignore_bad_records: modifiedDq.ignore_bad_records === '1' ? 'Y' : 'N',
              threshold_bad_records: parseInt(modifiedDq.threshold_bad_records),
              type: modifiedDq.type
            };
            // Pass the remaining values from modifiedDq to parameters
            Object.keys(modifiedDq).forEach((key) => {
              if (!['idx', 'check', 'active', 'ignore_bad_records', 'threshold_bad_records', 'type'].includes(key)) {
                newDataQuality.parameters[key] = modifiedDq[key];
              }
            });
            return newDataQuality;
          });
        }
      }

      if (modifiedData1?.task?.source?.source_type === "local_server_read") {
        modifiedData1.task.source.source_type = modifiedData1.task.source.file_type + "_read";
      }
      if (modifiedData1?.task?.target?.target_type === "local_server_write") {
        modifiedData1.task.target.target_type = modifiedData1.task.target.file_type + "_write";
      }
      
      if (!modifiedData1?.task?.data_quality_execution) {
        modifiedData1.task.data_quality_execution = {
          "pre_check_enable": "N",
          "post_check_enable": "N"
        };
      }

      const modifiedJsonData = JSON.stringify(modifiedData1, null, 2);
      const fileName = `program/ingestion_kart/task/${data[0].task_name}.json`;
      uploadFileToGitHub(
        fileName,
        modifiedJsonData,
        "Update task data",
        "update"
      )
        .then(() => {
          res.send(modifiedData1);
          logger.info("task data updated and pushed to GitHub", { exportFunction: "task.controller.updateGitData" });
        })
        .catch((err) => {
          console.log(err);
          logger.error("Error occurred while pushing JSON file to GitHub", { exportFunction: "task.controller.updateGitData" });
          res.status(500).send({
            message: err.message || "Some error occurred while updating the Task data.",
          });
        });
    }
  }
  catch (err) {
    console.log(err);
    logger.error("Error occurred while pushing JSON file to GitHub", { exportFunction: "task.controller.updateGitData" });
    res.status(500).send({
      message: err.message || "Some error occurred while updating the Task data.",
    });
  };
}

exports.checkTaskNameExistsInGitHub = (req, res) => {
  const id = req.params.id;
  db.sequelizeConfig
    .query(`SELECT * FROM vw_task_list WHERE id = ${id}`, { model: TaskList })
    .then((data) => {
      const modifiedJsonData = JSON.stringify(data, null, 2);
      const fileName = `task/${data[0].task_name}.json`;
      uploadFileToGitHub(fileName, "", "", "read")
        .then((exists) => {
          if (exists) {
            res.send(modifiedJsonData); // Task_name exists in GitHub
          } else {
            res.send(modifiedJsonData); // Task_name does not exist in GitHub
          }
        })
        .catch((err) => {
          // console.error(err);
          res.status(500).send({
            message: err.message || "Some error occurred while checking the Task in GitHub.",
          });
        });
    })
    .catch((err) => {
      logger.error("Error occurred while retrieving the task data", {
        exportFunction: "task.controller.checkTaskNameExistsInGitHub",
      });
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving the task data.",
      });
    });
};