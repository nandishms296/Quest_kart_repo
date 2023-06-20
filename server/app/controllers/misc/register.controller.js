const db = require("../../models");
const User = db.configModels.tbl_user;
const Op = db.Sequelize.Op;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const logger = require("../../config/logger");

exports.register = async (req, res) => {
  try {
    const { password } = req.body;

    const salt = await bcrypt.genSalt(3);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = {
      full_name: req.body.full_name,
      login_id: req.body.login_id,
      password: passwordHash,
      user_email: req.body.user_email,
      user_phone: req.body.user_phone,
      is_active: "N",
      created_by: req.body.login_id,
      updated_by: req.body.login_id,
    };

    const savedUser = await User.create(newUser);
    logger.info("new user created", {
      exportFunction: "register.controller.register",
    });
    res.status(201).json(savedUser);
  } catch (error) {
    logger.error("error while new user creating", {
      exportFunction: "register.controller.register",
    });
    res.status(500).json({ error: error.message });
  }
};

exports.handleNewUser = async (req, res) => {
  // validate request
  console.log(req.body);
  const { fullname, login_id, password } = req.body;

  console.log("login_id: ", login_id);
  console.log("password: ", password);
  if (!login_id || !password) {
    logger.info("Username and Password are required.", {
      exportFunction: "register.controller.handleNewUser",
    });
    return res.status(400).send({
      message: "Username and Password are required.",
    });
  }

  const duplcate = await User.findOne({ where: { login_id: login_id } });
  if (duplcate)
    return res
      .status(400)
      .json({ success: false, message: "User already exists!" });
  try {
    const salt = await bcrypt.genSalt(3);
    // encrypt  the password.
    const hashPwd = await bcrypt.hash(password, salt);
    const newUser = {
      full_name: fullname,
      login_id: login_id,
      password: hashPwd,
      user_email: "",
      is_active: "Y",
      created_by: login_id,
    };
    console.log("User Object : ", newUser);
    const data = await User.create(newUser);

    const token = jwt.sign({ login_id }, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "1h",
    });
    logger.info("new user registered", {
      exportFunction: "register.controller.handleNewUser",
    });
    res.status(201).json({
      success: true,
      result: { id: data.id, fullname: data.full_name, login_id, token },
    });
  } catch (error) {
    logger.error("Some error occurred while creating the User", {
      exportFunction: "register.controller.handleNewUser",
    });
    res.status(500).json({
      success: false,
      message: "Some error occurred while creating the User.",
    });
  }
};
