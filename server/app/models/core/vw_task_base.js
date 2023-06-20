const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_task_base', {
    sec: {
      type: DataTypes.STRING(6),
      allowNull: false,
      defaultValue: ""
    },
    connection_subtype: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    connection_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    field_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    display_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    value_01: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    field_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    display_sequence: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    category: {
      type: DataTypes.CHAR(1),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vw_task_base',
    timestamps: false
  });
};
