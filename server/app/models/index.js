const dbConfig = require("../config/db.config.js");
const dbCore = require("../config/db.core.js");

const Sequelize = require("sequelize");
const sequelizeConfig = new Sequelize(
  dbConfig.DB,
  dbConfig.USER,
  dbConfig.PASSWORD,
  {
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    port: dbConfig.PORT,
    operatorsAliases: false,

    pool: {
      max: dbConfig.pool.max,
      min: dbConfig.pool.min,
      acquire: dbConfig.pool.acquire,
      idle: dbConfig.pool.idle,
    },
  }
);

sequelizeConfig
  .authenticate()
  .then(() => {
    console.log(
      `Connection to database ${dbConfig.DB} has been established successfully.`
    );
  })
  .catch((error) => {
    console.error(`Unable to connect to the database: ${dbConfig.DB}`, error);
  });

const sequelizeCore = new Sequelize(dbCore.DB, dbCore.USER, dbCore.PASSWORD, {
  host: dbCore.HOST,
  dialect: dbCore.dialect,
  port: dbCore.PORT,
  operatorsAliases: false,

  pool: {
    max: dbCore.pool.max,
    min: dbCore.pool.min,
    acquire: dbCore.pool.acquire,
    idle: dbCore.pool.idle,
  },
});

sequelizeCore
  .authenticate()
  .then(() => {
    console.log(
      `Connection to database ${dbCore.DB} has been established successfully.`
    );
  })
  .catch((error) => {
    console.error(`Unable to connect to the database: ${dbCore.DB}`, error);
  });

const db = {};

const initConfigModels = require("./config/init-models");
const intiCoreModels = require("./core/init-models");

db.Sequelize = Sequelize;
db.sequelizeConfig = sequelizeConfig;
db.sequelizeCore = sequelizeCore;

db.configModels = initConfigModels(sequelizeConfig);
db.coreModels = intiCoreModels(sequelizeCore);

module.exports = db;
