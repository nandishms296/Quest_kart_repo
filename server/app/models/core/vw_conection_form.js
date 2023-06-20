const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_conection_form', {
    configuration_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    connection_type: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    connection_subtype: {
      type: DataTypes.TEXT,
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
    tableName: 'vw_conection_form',
    timestamps: false
  });
};
