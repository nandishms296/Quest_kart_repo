const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_connection_list', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    project_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    project_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    connection_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    connection_subtype: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    connection_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    fields_list: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vw_connection_list',
    timestamps: false
  });
};
