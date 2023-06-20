const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_object_form', {
    configuration_name: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    initialvalues: {
      type: DataTypes.JSON,
      allowNull: true
    },
    field_list: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vw_object_form',
    timestamps: false
  });
};
