const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_dq_parameter_base_old', {
    configuration_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    configuration_item: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    section: {
      type: DataTypes.STRING(50),
      allowNull: true
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
    tableName: 'vw_dq_parameter_base_old',
    timestamps: false
  });
};
