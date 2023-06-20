const DataTypes = require("sequelize").DataTypes;
const _lkp_column_reference = require("./lkp_column_reference");
const _lnk_user_project = require("./lnk_user_project");
const _tbl_connection = require("./tbl_connection");
const _tbl_connection_detail = require("./tbl_connection_detail");
const _tbl_etl_audit = require("./tbl_etl_audit");

const _tbl_pipeline = require("./tbl_pipeline");
const _tbl_program = require("./tbl_program");
const _tbl_project = require("./tbl_project");
const _tbl_task = require("./tbl_task");
const _tbl_task_parameter = require("./tbl_task_parameter");
const _tbl_user = require("./tbl_user");
const _vw_connection_list = require("./vw_connection_list");
const _vw_task_list = require("./vw_task_list");

function initModels(sequelize) {
  const lkp_column_reference = _lkp_column_reference(sequelize, DataTypes);
  const lnk_user_project = _lnk_user_project(sequelize, DataTypes);
  const tbl_connection = _tbl_connection(sequelize, DataTypes);
  const tbl_connection_detail = _tbl_connection_detail(sequelize, DataTypes);
  const tbl_etl_audit = _tbl_etl_audit(sequelize, DataTypes);

  const tbl_pipeline = _tbl_pipeline(sequelize, DataTypes);
  const tbl_program = _tbl_program(sequelize, DataTypes);
  const tbl_project = _tbl_project(sequelize, DataTypes);
  const tbl_task = _tbl_task(sequelize, DataTypes);
  const tbl_task_parameter = _tbl_task_parameter(sequelize, DataTypes);
  const tbl_user = _tbl_user(sequelize, DataTypes);
  const vw_connection_list = _vw_connection_list(sequelize, DataTypes);
  const vw_task_list = _vw_task_list(sequelize, DataTypes);

  tbl_task.belongsTo(tbl_pipeline, { as: "pipeline", foreignKey: "pipeline_id"});
  tbl_pipeline.hasMany(tbl_task, { as: "tbl_tasks", foreignKey: "pipeline_id"});
  lnk_user_project.belongsTo(tbl_program, { as: "program", foreignKey: "program_id"});
  tbl_program.hasMany(lnk_user_project, { as: "lnk_user_projects", foreignKey: "program_id"});
  tbl_project.belongsTo(tbl_program, { as: "program", foreignKey: "program_id"});
  tbl_program.hasMany(tbl_project, { as: "tbl_projects", foreignKey: "program_id"});
  lnk_user_project.belongsTo(tbl_project, { as: "project", foreignKey: "project_id"});
  tbl_project.hasMany(lnk_user_project, { as: "lnk_user_projects", foreignKey: "project_id"});
  tbl_connection.belongsTo(tbl_project, { as: "project", foreignKey: "project_id"});
  tbl_project.hasMany(tbl_connection, { as: "tbl_connections", foreignKey: "project_id"});
  tbl_pipeline.belongsTo(tbl_project, { as: "project", foreignKey: "project_id"});
  tbl_project.hasMany(tbl_pipeline, { as: "tbl_pipelines", foreignKey: "project_id"});
  tbl_task_parameter.belongsTo(tbl_task, { as: "task", foreignKey: "task_id"});
  tbl_task.hasMany(tbl_task_parameter, { as: "tbl_task_parameters", foreignKey: "task_id"});
  lnk_user_project.belongsTo(tbl_user, { as: "user", foreignKey: "user_id"});
  tbl_user.hasMany(lnk_user_project, { as: "lnk_user_projects", foreignKey: "user_id"});

  return {
    lkp_column_reference,
    lnk_user_project,
    tbl_connection,
    tbl_connection_detail,
    tbl_etl_audit,
    tbl_pipeline,
    tbl_program,
    tbl_project,
    tbl_task,
    tbl_task_parameter,
    tbl_user,
    vw_connection_list,
    vw_task_list,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
