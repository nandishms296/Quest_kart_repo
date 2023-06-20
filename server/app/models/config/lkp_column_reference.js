const Sequelize = require("sequelize");
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    "lkp_column_reference",
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      connection_name: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      schema_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      table_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      task_parameter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      source_field_name: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      source_field_dbtype: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      source_field_length: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      target_type: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      target_field_name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      target_field_type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      target_field_length: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      field_sequence: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      created_dttm: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_by: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      updated_dttm: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: Sequelize.Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      task_param_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: "lkp_column_reference",
      timestamps: false,
    }
  );
};
