const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_dq_parameter_base', {
    configuration_item: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    configuration_name: {
      type: DataTypes.STRING(12),
      allowNull: false,
      defaultValue: ""
    },
    section: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: ""
    },
    initial_values: {
      type: DataTypes.JSON,
      allowNull: true
    },
    fields_list: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vw_dq_parameter_base',
    timestamps: false
  });
};
