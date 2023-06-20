const crypto = require("crypto");

const URLSafeBase64 = require("urlsafe-base64");
const logger = require("../../config/logger");
const { S3Client, ListObjectsCommand } = require("@aws-sdk/client-s3");

function encrypt(val) {
  const CRYPTO_KEY = "8ookgvdIiH2YOgBnAju6Nmxtp14fn8d3";
  const CRYPTO_IV = "rBEssDfxofOveRxR";
  let cipher = crypto.createCipheriv("AES-256-CBC", CRYPTO_KEY, CRYPTO_IV);
  // UTF-8 to Base64 encoding
  let encrypted = cipher.update(val, "utf8", "base64");
  encrypted += cipher.final("base64");
  return URLSafeBase64.encode(encrypted);
}

function decrypt(encrypted) {
  const CRYPTO_KEY = "8ookgvdIiH2YOgBnAju6Nmxtp14fn8d3";
  const CRYPTO_IV = "rBEssDfxofOveRxR";
  encrypted = URLSafeBase64.decode(encrypted);
  let decipher = crypto.createDecipheriv("AES-256-CBC", CRYPTO_KEY, CRYPTO_IV);
  // Base64 to UTF-8 decoding
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
}

const encrypted_key = encrypt("Hello");
const original_input = decrypt("xd73YDvdCGL1_vdqYIgBQg");

require("dotenv").config();


const credentials = {
  COREUSER: process.env.DB_CORE_USER,
  COREPASSWORD: process.env.DB_CORE_PASSWORD,
  Token: process.env.ACCESS_TOKEN_SECRET,
  CONFIGUSER: process.env.DB_CONFIG_USER,
  CONFIGPASSWORD: process.env.DB_CONFIG_PASSWORD,
};

exports.mysqlConnectionCheck = (req, res) => {
  const mysql = require("mysql2");
  const params = {
    host: req.body.hostname,
    user: req.body.username,
    password: decrypt(req.body.password),
    port: req.body.port,
    database: req.body.database,
  };
  const connection = mysql.createConnection(params);
  connection.connect(function (err) {
    if (err) {
      logger.error("Error in the connection", {
        exportFunction: "testconnection.controller.mysqlConnectionCheck",
      });
      console.log("Error in the connection");
      console.log(err);
      res.status(500).send(err);
    } else {
      logger.info("connection successfull", {
        exportFunction: "testconnection.controller.mysqlConnectionCheck",
      });
      console.log(`Database Connected`);
      res.status(200).send("success");
    }
  });
};

exports.postgreSqlConnection = (req, res) => {
  const { Client } = require("pg");
  const client = new Client({
    user: req.body.username,
    host: req.body.host,
    database: req.body.DB_name,
    password: decrypt(req.body.password),
    port: req.body.port,
  });
  client.connect(function (err) {
    if (err) {
      logger.error("Error in the connection", {
        exportFunction: "testconnection.controller.postgreSqlConnection",
      });
      console.log("Error in the connection");
      console.log(err);
      res.status(500).send(err);
    } else {
      logger.info("connection successfull", {
        exportFunction: "testconnection.controller.postgreSqlConnection",
      });
      console.log(`Database Connected`);
      res.status(200).send("success");
    }
  });
};

exports.snowflakeConnection = (req, res) => {
  const snowflake = require("snowflake-sdk");

  // Create a connection configuration object
  const connection = {
    account: req.body.account,
    username: req.body.username,
    password: decrypt(req.body.password),
    warehouse: req.body.warehouse,
    database: req.body.database,
    schema: req.body.schema,
    role: req.body.role,
  };

  async function testConnection() {
    try {
      // Connect to Snowflake
      const conn = snowflake.createConnection(connection);
      await conn.connect();
      // Test the connection by listing the columns of a table
      console.log("snowflake successfully connected as id : " + conn.getId());
      console.log(`Snowflake Database Connected`);
      res.status(200).send("success");
      logger.info("connection successfull", {
        exportFunction: "testconnection.controller.snowflakeConnection",
      });
      // Close the connection
      await conn.destroy();
    } catch (err) {
      logger.error("Error in the connection", {
        exportFunction: "testconnection.controller.snowflakeConnection",
      });
      console.log("Error in the connection");
      console.log(err);
      res.status(500).send(err);
    }
  }
  testConnection();
};

exports.AWSConnection = (req, res) => {
  const { access_key, secret_access_key, bucket_name, region_name } = req.body;

  const s3 = new S3Client({
    credentials: {
      accessKeyId: access_key,
      secretAccessKey: secret_access_key,
    },
    region: region_name, // replace with the desired region
  });

  s3.send(new ListObjectsCommand({ Bucket: bucket_name }))
    .then(() => {
      console.log("AWS S3 connected successfully");
      res.send("AWS S3 connected successfully");
    })
    .catch((error) => {
      console.log(`Error in connecting to AWS S3: ${error.message}`);
      res.status(500).send(`Error in connecting to AWS S3: ${error.message}`);
    });
};


exports.oracleConnection = async (req, res) => {
  const oracledb = require("oracledb");
  oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

  try {
    await oracledb.getConnection({
      host: req.body.host,
      user: req.body.username,
      password: decrypt(req.body.password),
      // connectString:"192/168/56.2/orcl",s
      port: req.body.port,
      database: req.body.database,
      // servicename:req.body.servicename
    });
    logger.info("connection successfull", {
      exportFunction: "testconnection.controller.oracleConnection",
    });
    console.log(`Oracle Database Connected`);
    res.status(200).send("success");
  } catch (err) {
    logger.error("Error in the connection", {
      exportFunction: "testconnection.controller.oracleConnection",
    });
    console.log("Error in the connection");
    console.log(err);
    res.status(500).send(err);
  }
};

exports.mssqlConnection = (req, res) => {
  const sql_mssql = require("mssql");
  // config for your database
  const config = {
    user: req.body.username,
    password: decrypt(req.body.password),
    // port : req.body.port,
    database: req.body.database,
    server: req.body.hostname,
    synchronize: true,
    trustServerCertificate: true,
  };
  // connect to your database
  sql_mssql.connect(config, function (err) {
    if (err) {
      logger.error("Error in the connection", {
        exportFunction: "testconnection.controller.mssqlConnection",
      });
      console.log("Error in the connection");
      console.log(err);
      res.status(500).send(err);
    } else {
      sql_mssql.query(function (err, result) {
        if (err) throw err;
        console.log("Result: " + JSON.stringify(result));
      });
      logger.info("connection successfull", {
        exportFunction: "testconnection.controller.mssqlConnection",
      });
      console.log(`MS SQL Database Connected`);
      res.status(200).send("success");
    }
  });
};

exports.SFDCConnection = (req, res) => {
  const jsforce = require("jsforce");

  // Create a connection configuration object
  const connection = new jsforce.Connection({
    login_url: "https://login.salesforce.com",
  });

  async function testConnection() {
    try {
      // Connect to Salesforce
      await connection.login(
        req.body.username,
        decrypt(req.body.password) + req.body.security_token
      );
      // Test the connection by listing the columns of an object
      const object = "Account";
      const result = await connection.describe(object);
      const fields = result.fields;
      const columnNames = fields.map((f) => f.name);
      const dataTypes = fields.map((f) => f.type);
      logger.info("connection successfull", {
        exportFunction: "testconnection.controller.SFDCConnection",
      });
      console.log(`SFDC Database Connected`);
      res.status(200).send("success");
      console.log("Column names:", columnNames);
      console.log("Data types:", dataTypes);
    } catch (err) {
      logger.error("Error in the connection", {
        exportFunction: "testconnection.controller.SFDCConnection",
      });
      console.log("Error in the connection");
      console.log(err);
      res.status(500).send(err);
    }
  }

  testConnection();
};

exports.reshiftConnection = (req, res) => {
  const pgp = require("pg-promise")();
  const dbName = req.body.database;
  const connections = [];
  class Redshift {
    static async getConnection() {
      if (!connections[dbName]) {
        const dbUser = req.body.username;
        const dbPassword = decrypt(req.body.password);
        const dbHost = req.body.hostname;
        const dbPort = req.body.port;
        console.log(`Opening connection to: ${dbName}, host is: ${dbHost}`);
        const connectionString = `postgres://${dbUser}:${dbPassword}@${dbHost}:${dbPort}/${dbName}`;
        connections[dbName] = pgp(connectionString);
      }
      return connections[dbName];
    }
    static async executeQuery(query) {
      try {
        const connection = await this.getConnection();
        const result = await connection.query(query);

        console.log(`SFDC Database Connected`);
        logger.info("connection successfull", {
          exportFunction: "testconnection.controller.reshiftConnection",
        });
        res.status(200).send("success");
        console.log("Result: " + JSON.stringify(result));
      } catch (e) {
        logger.error("Error in the connection", {
          exportFunction: "testconnection.controller.reshiftConnection",
        });
        console.log("Error in the connection");
        console.log(e);
        res.status(500).send(e);
      }
    }
  }
  Redshift.executeQuery(`select * from pg_get_cols('date')
  cols(view_schema name, view_name name, col_name name, col_type varchar, col_num int) `);
};

exports.remoteserver = (req, res) => {
  const { Client } = require("ssh2");

  const conn = new Client();
  conn
    .on("ready", () => {
      console.log("Client :: ready");
      conn.sftp((err, sftp) => {
        if (err) throw err;
        sftp.readdir("/home/ubuntu/", (err, list) => {
          // req.body.path
          if (err) {
            res.status(500).send(err);
            throw err;
          }
          console.dir(list);
          conn.end();
          res.status(200).send("success");
        });
      });
    })
    .connect({
      host: req.body.hostname,
      port: 22,
      username: req.body.username,
      password: req.body.password,
    });
};

exports.localserver = async (req, res) => {
  const { access } = require("fs/promises");
  try {
    await access(req.body.file_path);
    res.status(200).send("success");
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.RestAPI = async (req, res) => {
  // const auth = require('basic-auth');

  const http = require("http");

  const url = req.body.url;

  const username = req.body.username;

  const password = decrypt(req.body.password);

  console.log(url, username, password);

  const basicAuth = (req, res, next) => {
    if (
      (credentials.COREUSER === username &&
        credentials.COREPASSWORD === password) ||
      (credentials.CONFIGUSER === username &&
        credentials.CONFIGPASSWORD === password)
    ) {
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  };

  const restAPIHandler = (req, res, url) => {
    const options = {
      method: "GET",

      headers: {
        "Content-Type": "application/json",
      },
    };

    const request = http.request(url, options, (response) => {
      let responseData = "";

      response.on("data", (chunk) => {
        responseData += chunk;
      });

      response.on("end", () => {
        res.status(200).send("Success");
      });
    });

    request.on("error", (error) => {
      res.status(500).send("Error: " + error);
    });

    request.end();
  };

  basicAuth(req, res, () => {
    restAPIHandler(req, res, url);
  });
};

exports.RestAPItoken = (req, res) => {
  const axios = require("axios");

  const url = req.body.url;

  const api_token = req.body.api_token;

  const restAPIHandler = (req, res, url) => {
    const authHeader = "Bearer " + api_token;

    axios
      .get(url, {
        headers: {
          Authorization: authHeader,
        },
      })

      .then((response) => {
        console.log("Response: " + JSON.stringify(response.data));

        res.status(200).send("Success");
      })

      .catch((error) => {
        console.log("Error: " + error);

        res.status(500).send("Error: " + error);
      });
  };

  restAPIHandler(req, res, url);
};
