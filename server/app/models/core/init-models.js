const DataTypes = require("sequelize").DataTypes;
const _tbl_configuration = require("./tbl_configuration");
const _tbl_configuration_detail = require("./tbl_configuration_detail");
const _tbl_configuration_option = require("./tbl_configuration_option");
const _vw_conection_form = require("./vw_conection_form");
const _vw_object_form = require("./vw_object_form");
const _vw_object_list = require("./vw_object_list");
const _vw_task_base = require("./vw_task_base");
const _vw_task_parameter_base = require("./vw_task_parameter_base");
const _vw_task_parameter_form = require("./vw_task_parameter_form");

function initModels(sequelize) {
  const tbl_configuration = _tbl_configuration(sequelize, DataTypes);
  const tbl_configuration_detail = _tbl_configuration_detail(
    sequelize,
    DataTypes
  );
  const tbl_configuration_option = _tbl_configuration_option(
    sequelize,
    DataTypes
  );
  const vw_conection_form = _vw_conection_form(sequelize, DataTypes);
  const vw_object_form = _vw_object_form(sequelize, DataTypes);
  const vw_object_list = _vw_object_list(sequelize, DataTypes);
  const vw_task_base = _vw_task_base(sequelize, DataTypes);
  const vw_task_parameter_base = _vw_task_parameter_base(sequelize, DataTypes);
  const vw_task_parameter_form = _vw_task_parameter_form(sequelize, DataTypes);

  return {
    tbl_configuration,
    tbl_configuration_detail,
    tbl_configuration_option,
    vw_conection_form,
    vw_object_form,
    vw_object_list,
    vw_task_base,
    vw_task_parameter_base,
    vw_task_parameter_form,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
