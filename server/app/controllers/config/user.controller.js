const db = require("../../models");
const User = db.configModels.tbl_user;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const logger = require("../../config/logger");
require("dotenv").config();


// Create and Save a new User
exports.create = (req, res) => {
  // validate request
  if (!req.body.full_name) {
    res.status(400).send({
      message: "Content can't be empty!.",
    });
    return;
  }
  // hash the password.

  //Create a User
  bcrypt.genSalt(3, (err, salt) => {
    if (err) {
      console.log("Error at genSalt function ", err);
    }
    console.log("salt = ", salt);
    bcrypt.hash(process.env.PASS, salt, (err, hash) => {
      if (err) {
        console.log("Error at hashSync function ", err);
      }
      console.log("hash = ", hash);

      const user = {
        full_name: req.body.full_name,
        login_id: req.body.login_id,
        password: hash,
        user_email: req.body.user_email,
        user_phone: req.body.user_phone,
        is_active: "Y",
        created_by: req.body.created_by,
      };
      console.log("User Object : ", user);

      //Save Program in the Database.
      User.create(user)
        .then((data) => {
          logger.info(
            "User created",
            { exportFunction: "user.controller.create" },
            user
          );
          res.send(data);
        })
        .catch((err) => {
          logger.error(err, "Some error occurred while creating the User");
          res.status(500).send({
            message:
              err.message || "Some error occurred while creating the User.",
          });
        });
    });
  });
};

// Login function will expect login_id and password. On successful password match, it will return a JWT token.
exports.login = (req, res) => {
  console.log("request body : ", req.body);
  User.findOne({ where: { login_id: req.body.login_id } }).then((user) => {
    if (user) {
      console.log("User : ", user);
      logger.info("User Logged in", user);
      bcrypt
        .compare(req.body.password, user.password)
        .then((password_valid) => {
          console.log("password valid : ", password_valid);
          if (password_valid) {
            res.status(200).json({ valid: true });
          } else {
            res.status(400).json({ error: "Password Incorrect" });
          }
        });
    } else {
      logger.error("User tried to login with user doesn't exists.", {
        exportFunction: "user.controller.login",
      });
      res.status(404).json({ error: "User does not exist" });
    }
  });
};

// Reterive all User from the database.
exports.findAll = (req, res) => {
  const login_id = req.query.login_id;
  const condition = login_id
    ? { login_id: { [Op.like]: `%${login_id}` } }
    : null;

  User.findAll({ where: condition })
    .then((data) => {
      logger.info("Retrieveing the user details", {
        exportFunction: "user.controller.findAll",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error occurred while retrieving User", {
        exportFunction: "user.controller.findAll",
      });
      res.status(500).send({
        message:
          err.message ||
          `Some error occurred while retrieving User for login_id = ${login_id}.`,
      });
    });
};

// Find a single User with an id
exports.findUser = async (req, res) => {
  const id = req.params.id;
  try {
    const data = await User.findOne({ where: { id: id } });

    if (data) {
      delete data.password;
      logger.info("Retrieving the user with id", {
        exportFunction: "user.controller.findUser",
      });
      res.send(data);
    } else {
      logger.info("Cannot find User", {
        exportFunction: "user.controller.findAll",
      });
      res.status(404).send({ message: `Cannot find User with Id=${id}.` });
    }
  } catch (err) {
    logger.error("Error occured while fetching", {
      exportFunction: "user.controller.findUser",
    });
    res
      .status(500)
      .send({ message: "Error occured while fetching " + err.message });
  }
};

exports.findByName = async (req, res) => {
  const login_id = req.params.login_id;
  try {
    const data = await User.findOne({ where: { login_id: login_id } });
      res.send(data);
    
  } catch (err) {
    logger.error("Error occured while fetching", {
      exportFunction: "user.controller.findByName",
    });
    res
      .status(500)
      .send({ message: "Error occured while fetching " + err.message });
  }
};

// Update a User by the id in the request
exports.update = (req, res) => {
  const id = req.params.id;
  User.update(req.body, {
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        logger.info("User Updated successfully", {
          exportFunction: "user.controller.update",
        });
        res.send({
          message: "User was updated scuccessfully.",
        });
      } else {
        logger.error("Cannot update User", {
          exportFunction: "user.controller.update",
        });
        res.send({
          message: `Cannot update User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.error("Error updating User", {
        exportFunction: "user.controller.update",
      });
      res.status(500).send({
        message: "Error updating User with id=" + id,
      });
    });
};

// Delete a User with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;
  User.update(
    { is_active: "N" },
    {
      where: { id: id, is_active: "N" },
    }
  )
    .then((num) => {
      if (num == 1) {
        logger.info("user was soft deleted", {
          exportFunction: "user.controller.delete",
        });
        res.send({
          message: "User was soft delete scuccessfully.",
        });
      } else {
        logger.info("Cannot soft delete User", {
          exportFunction: "user.controller.delete",
        });
        res.send({
          message: `Cannot soft delete User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.error("error soft deleting", {
        exportFunction: "user.controller.delete",
      });
      res.status(500).send({
        message: "Error soft deleting User with id=" + id,
      });
    });
};

exports.activate = (req, res) => {
  const id = req.params.id;
  User.update(
    { is_active: "Y" },
    {
      where: { id: id},
    }
  )
    .then((num) => {
      if (num == 1) {
        logger.info("user is activated", {
          exportFunction: "user.controller.delete",
        });
        res.send({
          message: "User is activated.",
        });
      } else {
        logger.info("Cannot activate the user", {
          exportFunction: "user.controller.delete",
        });
        res.send({
          message: `Cannot activate User with id=${id}. Maybe User was not found or req.body is empty!`,
        });
      }
    })
    .catch((err) => {
      logger.error("error activating", {
        exportFunction: "user.controller.delete",
      });
      res.status(500).send({
        message: "Error activating User with id=" + id,
      });
    });
};

exports.userExistsorNot = (req, res) => {
  const login_id = req.params.login_id;
  db.sequelizeConfig
    .query(`SELECT * FROM config.tbl_user where login_id = "${login_id}"`, {
      model: User,
    })
    .then((data) => {
      if (data.length > 0) {
        res.send({ exists: true });
      } else {
        res.send({ exists: false });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving.",
      });
    });
};
// Find all published User
exports.findAllActive = (req, res) => {
  User.findAll({ where: { is_active: "Y" } })
    .then((data) => {
      logger.info("finding all the active users", {
        exportFunction: "user.controller.findallactive",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error occurred while retrieving users", {
        exportFunction: "user.controller.findallactive",
      });
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users.",
      });
    });
};

exports.getIdAndName = (req, res) => {
  let sql = "SELECT id, login_id as name FROM tbl_user where is_active = 'Y'";
  console.log("SQL: ", sql);

  db.sequelizeConfig
    .query(sql, { model: User })
    .then((data) => {
      logger.info("retrieving the id and name", {
        exportFunction: "user.controller.getIDAndName",
      });
      res.send(data);
    })
    .catch((err) => {
      logger.error("error occured while retrieving the id and name", {
        exportFunction: "user.controller.getIDAndName",
      });
      res.status(500).send({
        message:
          err.message ||
          "Some error occurred while retrieving active projects.",
      });
    });
};

exports.updateProfile = async (req, res) => {
  const id = req.body.id;
  const updatedUser = await User.update(req.body, {
    where: { id: id },
  });

  const accessToken = jwt.sign(
    { login_id: updatedUser.login_id },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );
  logger.info("profile update", {
    exportFunction: "user.controller.updateProfile",
  });
  res.status(200).json({
    success: true,
    result: {
      login_id: updatedUser.login_id,
      user_email: updatedUser.user_email,
      user_phone: updatedUser.user_phone,
      token: accessToken,
    },
  });
};
