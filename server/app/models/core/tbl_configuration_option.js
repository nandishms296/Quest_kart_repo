const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tbl_configuration_option', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    configuration_detail_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    display_sequence: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    configuration_item: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    field_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    display_name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    key_01: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    value_01: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    field_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    remarks: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    is_active: {
      type: DataTypes.CHAR(1),
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    created_dttm: {
      type: DataTypes.DATE,
      allowNull: false,
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
    },
    configuration_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    required: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    key_02: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    valye_02: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    category: {
      type: DataTypes.CHAR(1),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tbl_configuration_option',
    timestamps: false
  });
};
