const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_task', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pipeline_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'tbl_pipeline',
        key: 'id'
      }
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
      type: DataTypes.STRING(50),
      allowNull: false
    },
    is_active: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    created_dttm: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    },
    updated_by: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    updated_dttm: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP')
    }
  }, {
    sequelize,
    tableName: 'tbl_task',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "id" },
        ]
      },
      {
        name: "tbl_task_pipeline_id_fkey",
        using: "BTREE",
        fields: [
          { name: "pipeline_id" },
        ]
      },
    ]
  });
};
