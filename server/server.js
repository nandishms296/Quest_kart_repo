const express = require("express");
const path = require("path");
const cors = require("cors");
const corsOptions = require("./app/config/corsOptions");
const credentials = require("./app/middleware/credentials");
const cookieParser = require("cookie-parser");

const app = express();

app.use(credentials);
app.use(cors(corsOptions));

const db = require("./app/models");

// parse request of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extend: true }));

//middleware for cookies
app.use(cookieParser());

require("./app/routes/program.routes")(app);
require("./app/routes/etl_audit.routes")(app);
require("./app/routes/connection.routes")(app);
require("./app/routes/task_parameter.routes")(app);
require("./app/routes/connection_detail.routes")(app);
require("./app/routes/user.routes")(app);
require("./app/routes/project.routes")(app);
require("./app/routes/lnkuserproject.routes")(app);
require("./app/routes/pipeline.routes")(app);
require("./app/routes/task.routes")(app);
require("./app/routes/preview.routes")(app);
require("./app/routes/configuration.routes")(app);
require("./app/routes/configuration_details.routes")(app);
require("./app/routes/configuration_options.routes")(app);
require("./app/routes/register.routes")(app);
require("./app/routes/auth.routes")(app);
require("./app/routes/refresh.routes")(app);
require("./app/routes/logout.routes")(app);
require("./app/routes/testconnections.routes")(app);
require("./app/routes/columnreference.routes")(app);

/* // simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Test application." });
}); */

const bodyParser = require("body-parser");
app.use(bodyParser.json());

let root = require("path").join(__dirname, "build");
if (process.env.NODE_ENV == "development") {
  app.use(express.static(root));
  app.use("/*", (req, res) => {
    console.log("__dirname: ", __dirname);
    res.sendFile(path.join(__dirname, "build", "index.html"));
  });
} else {
  root = require("path").join(__dirname, "..", "client", "build");
  app.use(express.static(root));
  app.use("/*", (req, res) => {
    console.log("__dirname: ", __dirname);
    res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
  });
}

// set PORT, listen for requests
const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

module.exports = server;
