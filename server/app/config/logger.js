const winston = require("winston");

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(
      (info) =>
        `${info.timestamp} | ${
          info.exportFunction
        } | ${info.level.toUpperCase()} | ${info.message} `
    )
  ),
  transports: [new winston.transports.File({ filename: "serverLog.log" })],
});

module.exports = logger;
