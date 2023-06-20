const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_task_parameter_form', {
    section: {
      type: DataTypes.STRING(11),
      allowNull: true
    },
    initialvalues: {
      type: DataTypes.JSON,
      allowNull: true
    },
    fields_list: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vw_task_parameter_form',
    timestamps: false
  });
};
