const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('vw_object_list', {
    object_id: {
      type: DataTypes.STRING(11),
      allowNull: false,
      defaultValue: ""
    },
    option_list: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'vw_object_list',
    timestamps: false
  });
};
