const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_task_parameter_base', {
    configuration_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
      defaultValue: ""
    },
    section: {
      type: DataTypes.STRING(6),
      allowNull: true,
      defaultValue: ""
    },
    section_object: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vw_task_parameter_base',
    timestamps: false
  });
};
