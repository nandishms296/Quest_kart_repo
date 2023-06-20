const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_etl_audit', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    pipeline_id: {
        type: DataTypes.STRING(150),
        allowNull: false
      },
    'task/pipeline_name': {
      type: DataTypes.STRING(150),
      allowNull: false
    },
   
    run_id: {
        type: DataTypes.STRING(150),
      allowNull: false
    },
    iteration: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    audit_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    audit_value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    process_dttm: {
      type: DataTypes.STRING(150),
      allowNull: false
    }
  }, {
    sequelize,
    tableName: 'tbl_etl_audit',
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
    ]
  });
};
