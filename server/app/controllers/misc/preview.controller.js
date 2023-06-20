const crypto = require("crypto");
const db = require("../../models");
const ConnectionList = db.configModels.vw_connection_list;
const ColumnReference = db.configModels.lkp_column_reference;
const Preview = db.configModels.lkp_column_reference;
const logger = require("../../config/logger");
const URLSafeBase64 = require("urlsafe-base64");
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3");
const csv = require("csv-parser");

function encrypt(val) {
  const CRYPTO_KEY = "8ookgvdIiH2YOgBnAju6Nmxtp14fn8d3";
  const CRYPTO_IV = "rBEssDfxofOveRxR";
  let cipher = crypto.createCipheriv("aes-256-cbc", CRYPTO_KEY, CRYPTO_IV);
  // UTF-8 to Base64 encoding
  let encrypted = cipher.update(val, "utf8", "base64");
  encrypted += cipher.final("base64");
  return URLSafeBase64.encode(encrypted);
}

function decrypt(encrypted) {
  const CRYPTO_KEY = "8ookgvdIiH2YOgBnAju6Nmxtp14fn8d3";
  const CRYPTO_IV = "rBEssDfxofOveRxR";
  encrypted = URLSafeBase64.decode(encrypted);
  let decipher = crypto.createDecipheriv("aes-256-cbc", CRYPTO_KEY, CRYPTO_IV);
  // Base64 to UTF-8 decoding
  let decrypted = decipher.update(encrypted, "base64", "utf8");
  return decrypted + decipher.final("utf8");
}

const connectionInfoForId = async (connectionId) => {
  const data = await db.sequelizeConfig.query(
    `SELECT project_name,connection_type,lower(connection_subtype) as connection_subtype,
          connection_name,fields_list as connection_details 
        FROM config.vw_connection_list WHERE id = ${connectionId}`,
    {
      model: ConnectionList,
    }
  );
  return data[0].dataValues;
};


//*****************************MySql DB Connection and previewing MySql DB tables****************

const mysql = require("mysql2/promise");

exports.mysqlPreviewTable = async (req, res) => {
  const data = req.query;
  try {
    const { connection_id, table_name, schema_name } = data;
    console.log("schema_name", schema_name);
    const connectionRecord = await connectionInfoForId(connection_id);
    const {
      connection_details: connDetails,
      connection_subtype: database_type,
    } = connectionRecord;
    let connDetailRecord = Object.assign({}, ...connDetails);

    const {
      hostname: host,
      port,
      username: user,
      database,
      password,
    } = connDetailRecord;

    const connectonString = {
      host,
      port,
      user,
      password: decrypt(password),
      database,
    };
console.log("mysql",connectonString);
    // Create a connection to the database
    const connectionMysql = await mysql.createConnection(connectonString);

    //Connect to the database
    const metaDataResult = await connectionMysql.query(
      `SELECT
        ROW_NUMBER() OVER () as id,
        column_name as actualColumns,
        column_name as aliasColumns,
        DATA_TYPE as sourceDatatype,
        DATA_TYPE as targetDatatype,
        CASE
          WHEN DATA_TYPE = 'varchar' THEN CHARACTER_MAXIMUM_LENGTH
          WHEN DATA_TYPE = 'char' THEN CHARACTER_MAXIMUM_LENGTH
          WHEN DATA_TYPE = 'text' THEN CHARACTER_MAXIMUM_LENGTH
          WHEN DATA_TYPE = 'int' THEN 4
          ELSE NULL
        END AS sourceLength,
        CASE
          WHEN DATA_TYPE = 'varchar' THEN CHARACTER_MAXIMUM_LENGTH
          WHEN DATA_TYPE = 'char' THEN CHARACTER_MAXIMUM_LENGTH
          WHEN DATA_TYPE = 'text' THEN CHARACTER_MAXIMUM_LENGTH
          WHEN DATA_TYPE = 'int' THEN 4
          ELSE NULL
        END AS targetLength
      FROM
        information_schema.columns
      WHERE table_name="${table_name}"`
    );
    let metaDataInfo = metaDataResult[0].reduce((acc, obj) => {
      const existing = acc.find(
        (item) => item.actualColumns === obj.actualColumns
      );
      if (!existing) {
        acc.push(obj);
      }
      return acc;
    }, []);

    const rowsResult = await connectionMysql.query(
      `SELECT * FROM ${database}.${table_name} tp limit 100`
    );
    logger.info("MySQL preview successfull", {
      exportFunction: "preview.controller.mysqlPreviewTable",
    });
    res.send({
      inputProps: { connection_id, schema_name, table_name, database_type },
      metaDataInfo,
      rows: rowsResult[0],
    });
  } catch (error) {
  logger.error("error occurred", {
    exportFunction: "preview.controller.mysqlPreviewTable",
  });
  console.log("Error: ", error);
  res.status(500).send({ message: error.message }); 
}
};

//************************************* Postgre SQL DB Connection and previewing Postgre DB tables**************************************

const { Client } = require("pg");

exports.postgresqlPreviewTable = async (req, res) => {
  const data = req.query;
  try {
    const { connection_id, table_name, schema_name, header } = data;
    console.log("header", header);

    const connectionRecord = await connectionInfoForId(connection_id);
    const {
      connection_details: connDetails,
      connection_subtype: database_type,
    } = connectionRecord;
    let connDetailRecord = Object.assign({}, ...connDetails);

    const { port, database, hostname, password, username } = connDetailRecord;

    const client = new Client({
      port,
      database,
      host: hostname,
      password: decrypt(password),
      user: username,
      schema_name,
      table_name,
    });

    client.connect((error) => {
      if (error) {
        logger.error("Error connecting to the database", {
          exportFunction: "preview.controller.postgresqlPreviewTable",
        });
        console.error("Error connecting to the database: ", error.message);
        res.status(500).json({  message: error.message  }); // Send the error message to the frontend
        return;
      }
      console.log("Successfully connected to the POSTGRESQL database ");
      logger.info("Successfully connected to the POSTGRESQL database", {
        exportFunction: "preview.controller.postgresqlPreviewTable",
      });
    });

    client.query(
      `SELECT
      ROW_NUMBER() OVER () as "id",
      column_name as "actualColumns",
      column_name as "aliasColumns",
      DATA_TYPE as "sourceDatatype",
      DATA_TYPE as "targetDatatype",
      CASE
                WHEN DATA_TYPE = 'character' THEN CHARACTER_MAXIMUM_LENGTH
                WHEN DATA_TYPE = 'character' THEN CHARACTER_MAXIMUM_LENGTH
                WHEN DATA_TYPE = 'text' THEN 32
                WHEN DATA_TYPE = 'integer' THEN 4
                ELSE NULL
              END AS "sourceLength",
             CASE
                WHEN DATA_TYPE = 'character' THEN CHARACTER_MAXIMUM_LENGTH
                WHEN DATA_TYPE = 'character' THEN CHARACTER_MAXIMUM_LENGTH
                WHEN DATA_TYPE = 'text' THEN CHARACTER_MAXIMUM_LENGTH
                WHEN DATA_TYPE = 'integer' THEN 4
                ELSE NULL
                END AS "targetLength"
             FROM
              information_schema.columns
            WHERE table_name='${table_name}'`,
      (error, result1) => {
        if (error) {
          logger.error("Error fetching metadata info", {
            exportFunction: "preview.controller.postgresqlPreviewTable",
          });
          console.error("Error fetching metadata info: ", error.message);
          res.status(500).json({  message: error.message  });
          client.end();
          return;
        }
        client.query(
          `SELECT * FROM  ${schema_name}.${table_name} tp limit 6`,
          (error, result2) => {
            if (error) {
              logger.error("Error fetching table rows", {
                exportFunction: "preview.controller.postgresqlPreviewTable",
              });
              console.error("Error fetching table rows: ", error.message);
              res.status(500).json({ message: error.message }); // Send the error message to the frontend
              client.end();
              return;
            }

            // Send all results in a single response
            logger.info("PostgreSQL preview successfull", {
              exportFunction: "preview.controller.postgresqlPreviewTable",
            });
            res.send({
              inputProps: {
                connection_id,
                schema_name,
                table_name,
                database_type,
              },
              metaDataInfo: result1.rows,
              rows: result2.rows,
            });
            client.end();
          }
        );
      }
    );
  } catch (error) {
    logger.error("error occurred", {
      exportFunction: "preview.controller.postgresqlPreviewTable",
    });
    console.log("Error: ", error);
    res.status(500).send({ message: error.message }); // Send the error message to the frontend
  }
};

//***************************************MS SQL DB Connection and previewing MSSQL DB tables***************

const sql = require("mssql");

exports.myssqlPreviewTable = async (req, res) => {
  const data = req.query;
  try {
    const { connection_id, table_name, schema_name } = data;

    const connectionRecord = await connectionInfoForId(connection_id);
    const {
      connection_details: connDetails,
      connection_subtype: database_type,
    } = connectionRecord;
    let connDetailRecord = Object.assign({}, ...connDetails);

    const { database, hostname, password, username } = connDetailRecord;

    const config = {
      user: username,
      password: decrypt(password),
      server: hostname,
      database,
      table_name,
      schema_name,
      synchronize: true,
      trustServerCertificate: true,
    };

    await sql.connect(config);
    console.log("successfully connected to MSSQL DB");
    logger.info("successfully connected to MSSQL DB", {
      exportFunction: "preview.controller.myssqlPreviewTable",
    });
    const request1 = new sql.Request();
    request1.query(
      `SELECT ROW_NUMBER() OVER (ORDER BY column_name) AS id,
    column_name AS actualColumns,
    column_name AS aliasColumns,
    DATA_TYPE AS sourceDatatype,
    DATA_TYPE AS targetDatatype,
    CASE 
        WHEN DATA_TYPE = 'varchar' THEN CHARACTER_MAXIMUM_LENGTH
        WHEN DATA_TYPE = 'int' THEN 4
        ELSE NULL 
    END AS sourceLength,
    CASE 
        WHEN DATA_TYPE = 'varchar' THEN CHARACTER_MAXIMUM_LENGTH
        WHEN DATA_TYPE = 'int' THEN 4
        ELSE NULL 
    END AS targetLength
FROM ${schema_name}.columns
WHERE table_name = '${table_name}'`,
      (error, result1) => {
        if (error) {
          logger.error("Error retrieving metadata information", {
            exportFunction: "preview.controller.myssqlPreviewTable",
          });
          console.log(error);
          res.status(500).send({ message: error.message });
        } else {
          const request2 = new sql.Request();
          request2.query(
            `SELECT TOP 6 * FROM ${table_name}`,
            (error, result2) => {
              if (error) {
                logger.error("Error retrieving table rows", {
                  exportFunction: "preview.controller.myssqlPreviewTable",
                });
                console.log(error);
                res.status(500).send({ message: error.message });
              } else {
                logger.info("MSSQL Preview successfull", {
                  exportFunction: "preview.controller.myssqlPreviewTable",
                });
                res.send({
                  inputProps: {
                    connection_id,
                    schema_name,
                    table_name,
                    database_type,
                  },
                  metaDataInfo: result1.recordset,
                  rows: result2.recordset,
                });
              }
              sql.close();
            }
          );
        }
      }
    );
  } catch (error) {
    logger.error("Error connecting to MSSQL database", {
      exportFunction: "preview.controller.myssqlPreviewTable",
    });
    console.log("Error: ", error);
    res.status(500).send({ message: error.message }); // Send the error message to the frontend
  }
};

//*************************** Oracle DB Connection and previewing  Oracle DB tables ****************/

const oracledb = require("oracledb");
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

exports.oraclePreviewTable = async (req, res) => {
  const data = req.query;
  const { connection_id, table_name, schema_name, header } = data;
  try {
    const connectionRecord = await connectionInfoForId(connection_id);
    const {
      connection_details: connDetails,
      connection_subtype: database_type,
    } = connectionRecord;
    let connDetailRecord = Object.assign({}, ...connDetails);

    const { hostname, password, username } = connDetailRecord;

    // Create a connection to the database
    const con = await oracledb.getConnection({
      user: username,
      password: decrypt(password),
      table_name: table_name,
    });
    console.log("Successfully connected to ORACLE DB!");
    logger.info("Successfully connected to ORACLE DB!", {
      exportFunction: "preview.controller.oraclePreviewTable",
    });
    const data = await con.execute(
      `SELECT ROW_NUMBER() OVER (ORDER BY column_name) AS "id",
      column_name AS "actualColumns",
      column_name AS "aliasColumns",
      DATA_TYPE AS "sourceDatatype",
      DATA_TYPE AS "targetDatatype",
      data_length AS "sourceLength",
      data_length AS "targetLength"
      FROM ALL_TAB_COLUMNS
      WHERE table_name ='${table_name}'`
    );

    const data1 = await con.execute(
      `SELECT * FROM ${table_name} WHERE rownum <= 5`
    );
    logger.info("Oracle preview successfull", {
      exportFunction: "preview.controller.oraclePreviewTable",
    });
    res.send({
      inputProps: { connection_id, schema_name, table_name, database_type },
      metaDataInfo: data.rows,
      rows: data1.rows,
    });
  } catch (error) {
    logger.error("ORACLE Database Connection Failed !!!", {
      exportFunction: "preview.controller.oraclePreviewTable",
    });
    console.log("Error: ", error);
    res.status(500).send({ message: error.message }); // Send the error message to the frontend
  }
};

//****************************************** snowflake DB Connection and previewing  snowflake DB tables********************************************************** */

const snowflake = require("snowflake-sdk");

exports.snowflakePreviewTable = async (req, res) => {
  const data = req.query;
  const { connection_id, table_name, schema_name } = data;
  try {
    const connectionRecord = await connectionInfoForId(connection_id);
    const {
      connection_details: connDetails,
      connection_subtype: database_type,
    } = connectionRecord;
    let connDetailRecord = Object.assign({}, ...connDetails);

    const { database, password, username, account, warehouse } =
      connDetailRecord;

    const config = {
      account: account,
      username: username,
      password: decrypt(password),
      database: database,
      table_name: table_name,
      warehouse: warehouse,
      schema_name: schema_name,
    };

    const connection = snowflake.createConnection(config);

    connection.connect((err, conn) => {
      if (err) {
        logger.error("Unable to connect to snowflake", {
          exportFunction: "preview.controller.snowflakePreviewTable",
        });
        console.error("Unable to connect: ", err);
        throw err;
      } else {
        logger.info("Successfully connected to Snowflake.", {
          exportFunction: "preview.controller.snowflakePreviewTable",
        });
        console.log("Successfully connected to Snowflake.");
      }
    });

    const queries = [
      `SELECT ROW_NUMBER() OVER (ORDER BY column_name) AS "id", 
column_name AS "actualColumns", 
column_name AS "aliasColumns", 
DATA_TYPE AS "sourceDatatype", 
DATA_TYPE AS "targetDatatype", 
CASE 
WHEN data_type IN ('TEXT', 'VARCHAR','STRING') THEN CHARACTER_MAXIMUM_LENGTH 
WHEN data_type = 'NUMBER' THEN 4 ELSE NULL END AS "sourceLength", 
CASE 
WHEN data_type IN ('TEXT', 'VARCHAR','STRING') THEN CHARACTER_MAXIMUM_LENGTH 
WHEN data_type = 'NUMBER' THEN 4 ELSE NULL END AS "targetLength" FROM information_schema.columns 
WHERE table_name = '${table_name}' AND table_schema = '${schema_name}' ORDER BY "id"`,

      `SELECT * FROM ${schema_name}.${table_name} FETCH FIRST 10 ROWS ONLY`,
    ];

    Promise.all(
      queries.map(
        (query) =>
          new Promise((resolve, reject) => {
            connection.execute({
              sqlText: query,
              complete: (err, stmt, rows) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(rows);
                }
              },
            });
          })
      )
    )
      .then((results) => {
        console.log("All queries executed successfully.");
        const metaDataInfo = results[0];
        const rows = results[1];

        const output = {
          inputProps: { connection_id, schema_name, table_name, database_type },
          metaDataInfo,
          rows,
        };
        logger.info("Snowflake preview Successfull", {
          exportFunction: "preview.controller.snowflakePreviewTable",
        });
        res.send(output);
      })
      .catch((error) => {
        logger.error("Error executing queries", {
          exportFunction: "preview.controller.snowflakePreviewTable",
        });
        console.error("Error executing queries: ", error);
        res.status(500).send({ message: error.message}); // Send the error message to the frontend
      });
  } catch (error) {
    logger.error("Error occurred", {
      exportFunction: "preview.controller.snowflakePreviewTable",
    });
    console.error("Error occurred: ", err);
    res.status(500).send({ message: error.message});
  }
};
//*************************************AWS S3 CSV/TEXT file ******************************/
const getDataType = (values) => {
  const isInt = (arr) => arr.every((val) => Number.isInteger(Number(val)));
  const isFloat = (arr) =>
    arr.every((val) => Number(parseFloat(val)) === Number(val));
  const isBoolean = (arr) =>
    arr.every((val) => val === "true" || val === "false");
  const isDate = (arr) => arr.every((val) => !isNaN(Date.parse(val)));
  if (isInt(values)) return { type: "int", length: 32 };
  if (isFloat(values)) return { type: "float", length: 4 };
  if (isBoolean(values)) return { type: "boolean", length: 20 };
  const lengths = values.map((val) => (val ? val.toString().length : 0));
  return {
    type: isDate(values) ? "date" : "string",
    length: Math.max(...lengths),
  };
};

exports.awss3PreviewObjectCsv = async (req, res) => {
  const data = req.query;

  try {
    const { connection_id, header, table_name, filepath } = data;

    console.log("table_name", table_name + filepath);

    console.log("header", header);

    const header1 = parseInt(data.header);

    console.log("header1", header1); // Retrieve connection details for S3 bucket from database

    const connectionRecord = await connectionInfoForId(connection_id); //const { connection_details: connDetails } = connectionRecord;

    const {
      connection_details: connDetails,
      connection_subtype: database_type,
    } = connectionRecord;

    const connDetailRecord = Object.assign({}, ...connDetails);

    const { access_key, secret_access_key, bucket_name, region_name } =
      connDetailRecord;

    console.log("region", connDetailRecord); // Initialize S3 client with access key and secret access key

    const s3 = new S3Client({
      region: region_name, // Replace with your desired AWS region

      credentials: {
        accessKeyId: decrypt(access_key),

        secretAccessKey: decrypt(secret_access_key),
      },
    });

    // Define parameters for S3 getObject() command
    const params = {
      Bucket: bucket_name,
      Key: filepath + table_name,
    };

    // Call S3 getObject() command to retrieve file content
    const data1 = await s3.send(new GetObjectCommand(params));

    const rows = [];

    // Read the CSV file and push each row to the rows array
    data1.Body.pipe(csv())
      .on("data", (row) => {
        rows.push(row);
      })
      .on("end", () => {
        let columnNames = [];
        if (header1 === 1) {
          // Extract column names from the first row
          columnNames = Object.keys(rows[0]);
        } else {
          // Set default column names to "column1", "column2", "column3", and so on
          columnNames = Object.keys(rows[0]).map(
            (key, index) => `column${index + 1}`
          );
        }

        // Extract values from each row
        const values = rows.map(Object.values);

        // Get data type for each column
        const dataTypes = columnNames.map((columnName, index) => {
          const columnValues = values.map((row) => row[index]);
          return getDataType(columnValues);
        });

        // Generate metadata information for text file based on column names
        const metaDataInfo = columnNames.map((columnName, index) => ({
          id: index,
          actualColumns: columnName,
          aliasColumns: columnName,
          sourceDatatype: dataTypes[index].type,
          targetDatatype: dataTypes[index].type,
          sourceLength: dataTypes[index].length,
          targetLength: dataTypes[index].length,
        }));

        const output = {
          inputProps: {
            connection_id,
            schema_name: bucket_name,
            table_name,
            database_type,
          },
          metaDataInfo,
          rows: rows.map((row) => {
            const values = Object.values(row);
            return columnNames.reduce(
              (obj, key, index) => ({ ...obj, [key]: values[index] }),
              {}
            );
          }),
        };

        logger.info("AWS S3 preview successful", {
          exportFunction: "preview.controller.awss3PreviewObjectCsv",
        });
        // Send output object as response
        res.send(output);
      });
  } catch (error) {
    logger.error("Error occurred while previewing AWS S3", {
      exportFunction: "preview.controller.awss3PreviewObjectCsv",
    });
    console.error("Error occurred: ", error);
    res.status(500).send({ message: error.message});
  }
};

//*************************************aws s3 for  Excel FILE *******************************/

const { Readable } = require("stream");
const ExcelJS = require("exceljs");

exports.awss3PreviewObjectExcel = async (req, res) => {
  const data = req.query;
  try {
    const { connection_id, header, table_name, filepath } = data;
    console.log("table_name", table_name + filepath);
    console.log("header", header);
    const header1 = parseInt(header);

    // Retrieve connection details for S3 bucket from database
    const connectionRecord = await connectionInfoForId(connection_id);
    const {
      connection_details: connDetails,
      connection_subtype: database_type,
    } = connectionRecord;
    const connDetailRecord = Object.assign({}, ...connDetails);
    const { access_key, secret_access_key, bucket_name ,region_name} = connDetailRecord;

    // Initialize S3 client with access key and secret access key
    const s3 = new S3Client({
      region:region_name,
      credentials: {
        accessKeyId: decrypt(access_key),
        secretAccessKey: decrypt(secret_access_key),
      },
    });

    // Define parameters for S3 getObject() command
    const params = {
      Bucket: bucket_name,
      Key: filepath + table_name,
    };

    // Call S3 getObject() command to retrieve file content
    const response = await s3.send(new GetObjectCommand(params));
    const readableStream = Readable.from(response.Body);

    // Load Excel workbook from S3 file content
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.read(readableStream);

    // Extract data from first worksheet
    const worksheet = workbook.worksheets[0];

    let columnNames = [];
    if (header1 === 1) {
      // Get column names from first row, skipping the first cell
      const rowValues = worksheet.getRow(1).values.slice(1);
      columnNames = rowValues.map((value, index) => {
        if (!value) {
          return `column${index + 1}`;
        }
        return value;
      });
    } else {
      // Set default column names to "column1", "column2", "column3", and so on
      const numColumns = worksheet.actualColumnCount;
      columnNames = Array.from(
        { length: numColumns },
        (_, i) => `column${i + 1}`
      );
    }

    // Extract values from each row
    const values = [];
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex !== 1 || header1 === 0) {
        // skip header row if present
        const rowValues = {};
        row.eachCell((cell, colNumber) => {
          rowValues[columnNames[colNumber - 1]] = cell.value;
        });
        values.push(rowValues);
      }
    });

    // Get data type for each column
    const dataTypes = columnNames.map((columnName, index) => {
      const columnValues = values.map((row) => row[columnName]);
      return getDataType(columnValues);
    });

    // Generate metadata information for Excel file based on column names
    const metaDataInfo = columnNames.map((columnName, index) => ({
      id: index,
      actualColumns: columnName,
      aliasColumns: columnName,
      sourceDatatype: dataTypes[index].type,
      targetDatatype: dataTypes[index].type,
      sourceLength: dataTypes[index].length,
      targetLength: dataTypes[index].length,
    }));

    const output = {
      inputProps: {
        connection_id,
        schema_name: bucket_name,
        table_name,
        database_type,
      },
      metaDataInfo,
      rows: values,
    };
    logger.info("AWS S3 Preview successful", {
      exportFunction: "preview.controller.awss3PreviewObjectCsv",
    });
    // Send output object as response
    res.send(output);
  } catch (error) {
    logger.error("Error occurred while previewing AWS S3", {
      exportFunction: "preview.controller.awss3PreviewObjectCsv",
    });
    console.error("Error occurred: ", error);
    res.status(500).send({ message: error.message});
  }
};

//****************************Redshift DB Connection and previewing Redshift DB tables ***********

exports.redshiftPreviewTable = async (req, res) => {
  const data = req.query;
  try {
    const { connection_id, table_name, schema_name, header } = data;
    console.log("header", header);

    const connectionRecord = await connectionInfoForId(connection_id);
    const {
      connection_details: connDetails,
      connection_subtype: database_type,
    } = connectionRecord;
    let connDetailRecord = Object.assign({}, ...connDetails);

    const { port, database, hostname, password, username } = connDetailRecord;

    const client = new Client({
      port,
      database,
      host: hostname,
      password: decrypt(password),
      user: username,
      schema: schema_name,
    });

    client.connect((error) => {
      if (error) {
        logger.error("Error connecting to the database", {
          exportFunction: "preview.controller.redshiftPreviewTable",
        });
        console.error("Error connecting to the database: ", error.message);
        res.status(500).json({ message: error.message });
        return;
      }
      console.log("Successfully connected to the Redshift database ");
      logger.info("Successfully connected to the Redshift database", {
        exportFunction: "preview.controller.redshiftPreviewTable",
      });
    });

    client.query(
      `SELECT
        ROW_NUMBER() OVER () as "id",
        column_name as "actualColumns",
        column_name as "aliasColumns",
        udt_name as "sourceDatatype",
        udt_name as "targetDatatype",
        CASE
          WHEN udt_name IN ('char', 'varchar') THEN character_maximum_length
          WHEN udt_name IN ('integer', 'bigint') THEN numeric_precision
          ELSE NULL
        END AS "sourceLength",
        CASE
          WHEN udt_name IN ('char', 'varchar') THEN character_maximum_length
          WHEN udt_name IN ('integer', 'bigint') THEN numeric_precision
          ELSE NULL
        END AS "targetLength"
        FROM
        information_schema.columns
        WHERE table_name='${table_name}' AND table_schema='${schema_name}'`,
      (error, result1) => {
        if (error) {
          logger.error("Error fetching metadata info", {
            exportFunction: "preview.controller.redshiftPreviewTable",
          });
          console.error("Error fetching metadata info: ", error.message);
          res.status(500).json({  message: error.message });
          client.end();
          return;
        }
        client.query(
          `SELECT * FROM  ${schema_name}.${table_name} tp limit 6`,
          (error, result2) => {
            if (error) {
              logger.error("Error fetching table rows", {
                exportFunction: "preview.controller.redshiftPreviewTable",
              });
              console.error("Error fetching table rows: ", error.message);
              res.status(500).json({ message: error.message });
              client.end();
              return;
            }

            // Send all results in a single response
            logger.info("Redshift preview successful", {
              exportFunction: "preview.controller.redshiftPreviewTable",
            });
            res.send({
              inputProps: {
                connection_id,
                schema_name,
                table_name,
                database_type,
              },
              metaDataInfo: result1.rows,
              rows: result2.rows,
            });
            client.end();
          }
        );
      }
    );
  } catch (error) {
    logger.error("error occurred", {
      exportFunction: "preview.controller.redshiftPreviewTable",
    });

    console.log("Error: ", error);
    res.status(500).send({ message: error.message }); // Send the error message to the frontend
  }
};

//********************************** LOCAL SERVER for  CSV FILE ***********************************

const fs = require("fs");
const path = require("path");
const dfd = require("danfojs-node");
const dataforge = require("data-forge");
const BASE_DIR = __dirname.replace(/^(.*server)(.*)$/, "$1");

exports.localServerFilePreviewCsv = async (req, res) => {
  const data = req.query;
  const { table_name, filepath, encoding, delimiter, header, connection_id } =
    data;
  console.log("data", data);
  const header1 = parseInt(data.header);
  console.log("header", header1);

  const connectionRecord = await connectionInfoForId(connection_id);
  const { connection_details: connDetails, connection_subtype: database_type } =
    connectionRecord;
  const connDetailRecord = Object.assign({}, ...connDetails);
  const {} = connDetailRecord;

  let fullFilePath;
  if (filepath.match(/^[A-Z]:\\|^\/\//i)) {
    // filepath is already an absolute path, so use as is
    fullFilePath = path.join(filepath, table_name);
  } else {
    fullFilePath = path.join(BASE_DIR, filepath, table_name);
  }

  console.log("Full file path: ", fullFilePath);

  try {
    const contents = fs.readFileSync(fullFilePath, encoding);
    const df1 = dataforge.fromCSV(contents, { delimiter });
    const values = df1.head(6).toArray();

    let actualColumns = [];
    let aliasColumns = [];
    if (header1 === 1) {
      actualColumns = df1.getColumnNames();
      aliasColumns = df1.getColumnNames();
    } else {
      actualColumns = Array.from(
        { length: df1.getColumnNames().length },
        (_, i) => `column${i + 1}`
      );
      aliasColumns = Array.from(
        { length: df1.getColumnNames().length },
        (_, i) => `column${i + 1}`
      );
    }

    let df = new dfd.DataFrame(values);
    let column_info = [];
    for (let i = 0; i < actualColumns.length; i++) {
      const dataType = df.dtypes[i];
      let length;
      switch (dataType) {
        case "float32":
        case "float64":
          length = 8;
          break;
        case "int8":
          length = 2;
          break;
        case "int16":
          length = 4;
          break;
        case "int32":
        case "uint8":
        case "uint16":
          length = 6;
          break;
        case "uint32":
        case "int64":
          length = 10;
          break;
        case "datetime":
          length = 20;
          break;
        default:
          length = 10;
      }
      column_info.push({
        id: i,
        actualColumns: actualColumns[i],
        aliasColumns: aliasColumns[i],
        sourceDatatype: dataType,
        targetDatatype: dataType,
        sourceLength: length,
        targetLength: length,
      });
    }
    const output = {
      inputProps: {
        connection_id,
        schema_name: table_name,
        table_name,
        database_type,
      },
      metaDataInfo: column_info,
      rows: values,
    };
    logger.info("File read successfully", {
      exportFunction: "preview.controller.readFile",
    });
    res.send(output);
  } catch (error) {
    logger.error("Error occurred while reading file", {
      exportFunction: "preview.controller.readFile",
    });
    console.log("Error: ", error);
    res.status(500).send({ message: error.message }); // Send the error message to the frontend
  }
};
//*******************************LOCAL SERVER for  Excel FILE ********************************************

const exceljs = require("exceljs");

exports.localServerFilePreviewExcel = async function (req, res) {
  const data = req.query;
  try {
    const { header, table_name, filepath, connection_id } = data;
    console.log("header", header);
    const header1 = parseInt(header);
    console.log("data", data);

    const connectionRecord = await connectionInfoForId(connection_id);
    const {
      connection_details: connDetails,
      connection_subtype: database_type,
    } = connectionRecord;
    const connDetailRecord = Object.assign({}, ...connDetails);
    const {} = connDetailRecord;

    let fullFilePath;
    if (filepath.match(/^[A-Z]:\\|^\/\//i)) {
      // filepath is already an absolute path, so use as is
      fullFilePath = path.join(filepath, table_name);
    } else {
      fullFilePath = path.join(BASE_DIR, filepath, table_name);
    }

    console.log("Full file path: ", fullFilePath);

    const filePath = path.resolve(fullFilePath);
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found at path: ${filePath}`);
    }

    // Load Excel workbook from local file
    const workbook = new exceljs.Workbook();
    await workbook.xlsx.readFile(filePath);

    // Extract data from first worksheet
    const worksheet = workbook.worksheets[0];

    let columnNames = [];
    if (header1 === 1) {
      // Get column names from first row, skipping the first cell
      const rowValues = worksheet.getRow(1).values.slice(1);
      columnNames = rowValues.map((value, index) => {
        if (!value) {
          return `column${index + 1}`;
        }
        return value;
      });
    } else {
      // Set default column names to "column1", "column2", "column3", and so on
      const numColumns = worksheet.actualColumnCount;
      columnNames = Array.from(
        { length: numColumns },
        (_, i) => `column${i + 1}`
      );
    }

    // Extract values from each row
    const values = [];
    worksheet.eachRow((row, rowIndex) => {
      if (rowIndex !== 1 || header1 === 0) {
        // skip header row if present
        const rowValues = {};
        row.eachCell((cell, colNumber) => {
          rowValues[columnNames[colNumber - 1]] = cell.value;
        });
        values.push(rowValues);
      }
    });

    // Get data type for each column
    const dataTypes = columnNames.map((columnName, index) => {
      const columnValues = values.map((row) => row[columnName]);
      return getDataType(columnValues);
    });

    // Generate metadata information for Excel file based on column names
    const metaDataInfo = columnNames.map((columnName, index) => ({
      id: index,
      actualColumns: columnName,
      aliasColumns: columnName,
      sourceDatatype: dataTypes[index].type,
      targetDatatype: dataTypes[index].type,
      sourceLength: dataTypes[index].length,
      targetLength: dataTypes[index].length,
    }));

    const output = {
      inputProps: {
        connection_id,
        schema_name: table_name,
        table_name,
        database_type,
      },
      metaDataInfo,
      rows: values,
    };
    res.send(output);
  }catch (error) {
    logger.error("Error occurred while reading file", {
      exportFunction: "preview.controller.readFile",
    });
    console.log("Error: ", error);
    res.status(500).send({ message: error.message }); // Send the error message to the frontend
  }
};

//************************* REST API ****************************

const axios = require("axios");

exports.restApiPreview = async (req, res) => {
  const data = req.query;

  try {
    const { connection_id, table_name, schema_name } = data;
    const connectionRecord = await connectionInfoForId(connection_id);
    const { connection_details: connDetails } = connectionRecord;
    const connDetailRecord = Object.assign({}, ...connDetails);
    const { url, username, password } = connDetailRecord;

    // Make the REST API request

    const response = await axios.get(url, {
      auth: {
        username,
        password,
      },
    });

    // Handle the response data or update the response as needed
    const responseData = response.data;

    // Extract metadata from the response and format it
    const metaDataInfo = Object.keys(responseData[0]).map((key, index) => {
      return {
        actualColumns: key,
        aliasColumns: key,
        sourceDatatype: typeof responseData[0][key],
        targetDatatype: typeof responseData[0][key],
        sourceLength: null,
        targetLength: null,
      };
    });

    // Continue with further processing or return the response data

    res.status(200).json({
      inputProps: {
        connection_id,
        schema_name,
        table_name,
        database_type: "REST API",
      },
      metaDataInfo,
      rows: responseData,
    });
  } catch (error) {
    console.log("Error: ", error);
    res.status(500).send("Internal Server Error");
  }
};


