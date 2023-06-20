require("dotenv").config();

module.exports = {
  HOST: process.env.DB_HOST,
  USER: process.env.DB_CONFIG_USER,
  PASSWORD: process.env.DB_CONFIG_PASSWORD,
  DB: process.env.DB_CONFIG,
  PORT: process.env.DB_PORT,
  dialect: process.env.DB_DIALECT,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};
