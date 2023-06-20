const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_task_list', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      primaryKey: true
    },
    task_name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    task_description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    task_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    task_sequence: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    source: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    target: {
      type: DataTypes.STRING(150),
      allowNull: true
    },
    is_active: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    details: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vw_task_list',
    timestamps: false
  });
};
