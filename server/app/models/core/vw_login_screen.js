const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_login_screen', {
    configuration_name: {
      type: DataTypes.STRING(225),
      allowNull: false
    },
    display_sequence: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    configuration_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    key_01: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    value_01: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    required: {
      type: DataTypes.CHAR(1),
      allowNull: true
    },
    field_type: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vw_login_screen',
    timestamps: false
  });
};
