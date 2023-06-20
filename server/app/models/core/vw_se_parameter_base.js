const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_se_parameter_base', {
    section: {
      type: DataTypes.STRING(50),
      allowNull: false,
      defaultValue: ""
    },
    item: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    FieldsList: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vw_se_parameter_base',
    timestamps: false
  });
};
