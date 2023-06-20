const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lkp_dq_master', {
    id: {
      autoIncrement: true,
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    dq_section: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    dq_type: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    dq_level: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    check_type: {
      type: DataTypes.STRING(30),
      allowNull: false
    },
    check_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    display_sequence: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    check_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    field_id: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    display_name: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    default_value: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    options: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    field_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    description: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    remarks: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    supported_datatypes: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    is_active: {
      type: DataTypes.STRING(1),
      allowNull: false
    },
    created_by: {
      type: DataTypes.STRING(50),
      allowNull: false
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
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'lkp_dq_master',
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
