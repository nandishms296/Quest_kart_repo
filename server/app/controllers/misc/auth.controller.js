const db = require("../../models");
const User = db.configModels.tbl_user;
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const logger = require("../../config/logger");

require("dotenv").config();

exports.login = async (req, res) => {
  try {
    const { login_id, password } = req.body;

    const user = await User.findOne({ where: { login_id: login_id } });
    if (!user) {
      logger.info("user doesnot exist", {
        exportFunction: "auth.controller.login",
      });
      return res.status(404).json({ error: "User does not exist" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      logger.info("password incorrect", {
        exportFunction: "auth.controller.login",
      });
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const token = jwt.sign({ id: login_id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    logger.info("login successfull", {
      exportFunction: "auth.controller.login",
    });
    const userData = user.dataValues;
    delete userData.password;
    res.status(200).json({ token, ...userData, expiresIn: 3600 });
  } catch (err) {
    logger.error("error occurred while login", {
      exportFunction: "auth.controller.login",
    });
    res.status(500).json({ error: err.message });
  }
};

// Login function will expect login_id and password. On successful password match, it will return a JWT token.
exports.handleLogin = async (req, res) => {
  console.log(req.body);
  const { login_id, password } = req.body;
  if (!login_id || !password)
    return res.status(400).send({
      message: "Username and Password are required.",
    });
  console.log("request body : ", req.body);
  const foundUser = await User.findOne({ where: { login_id: login_id } });
  if (!foundUser) return res.sendStatus(401); // Unauthorized

  //evaluate password
  const match = await bcrypt.compare(password, foundUser.password);
  if (match) {
    //create JWTs
    const accessToken = jwt.sign(
      { login_id: foundUser.login_id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    const refreshToken = jwt.sign(
      { login_id: foundUser.login_id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1h" }
    );
    console.log("foundUser: ", foundUser);
    // Saving refreshToken with CurrentUser
    const currentUser = {
      id: foundUser.id,
      full_name: foundUser.full_name,
      login_id: foundUser.login_id,
      password: foundUser.password,
      user_email: foundUser.user_email,
      user_phone: foundUser.user_phone,
      is_active: foundUser.is_active,
      created_by: foundUser.created_by,
      update_by: foundUser.created_by,
      refresh_token: refreshToken,
    };
    console.log("CurrentUser: ", currentUser);
    const num = await User.update(currentUser, {
      where: { id: currentUser.id },
    });
    console.log("Record Updated : ", num);
    res.status(200).json({
      success: true,
      result: {
        id: foundUser.id,
        fullname: foundUser.full_name,
        login_id,
        email: foundUser.user_email,
        phone: foundUser.user_phone,
        token: accessToken,
      },
    });
    logger.info("login successfull", {
      exportFunction: "auth.controller.handleLogin",
    });
  } else {
    logger.error("Invalid credentials", {
      exportFunction: "auth.controller.handleLogin",
    });
    return res
      .status(400)
      .json({ success: false, message: "Invalid credentials" });
  }
};

exports.changePassword = (req, res) => {
  const { login_id, oldPassword, newPassword, confirmPassword } = req.body;

  // Find the user in the database using the user ID
  User.findOne({
    where: { login_id: login_id },
  })
    .then((user) => {
      // Compare the old password provided in the request body with the stored password hash using bcrypt
      bcrypt.compare(oldPassword, user.password, (err, isMatch) => {
        if (err || !isMatch) {
          logger.info("Old password is incorrect.", {
            exportFunction: "auth.controller.changepassword",
          });
          res.status(400).send({
            message: "Old password is incorrect.",
          });
          return;
        }

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
          logger.info("New password and confirm password do not match.", {
            exportFunction: "auth.controller.changepassword",
          });
          res.status(400).send({
            message: "New password and confirm password do not match.",
          });
          return;
        }

        // Hash the new password using bcrypt
        bcrypt.genSalt(3, (err, salt) => {
          if (err) {
            logger.error("Error at genSalt function", {
              exportFunction: "auth.controller.changepassword",
            });
            console.log("Error at genSalt function ", err);
            res.status(500).send({
              message:
                err.message ||
                "Some error occurred while updating the password.",
            });
            return;
          }
          bcrypt.hash(newPassword, salt, (err, hash) => {
            if (err) {
              logger.error("Error at hashSync function", {
                exportFunction: "auth.controller.changepassword",
              });
              console.log("Error at hashSync function ", err);
              res.status(500).send({
                message:
                  err.message ||
                  "Some error occurred while updating the password.",
              });
              return;
            }

            // Update the password hash in the user object with the new password hash
            user.password = hash;

            // Save the updated user object in the database
            user
              .save()

              .then((updatedUser) => {
                logger.info("Password successfully updated", {
                  exportFunction: "auth.controller.changepassword",
                });
                return res.status(200).send({
                  message: "Password successfully updated",
                  data: updatedUser,
                });
              })
              .catch((err) => {
                logger.info("Password successfully updated", {
                  exportFunction: "auth.controller.changepassword",
                });
                res.status(500).send({
                  message:
                    err.message ||
                    "Some error occurred while updating the password.",
                });
              });
          });
        });
      });
    })
    .catch((err) => {
      logger.error("Error retrieving user", {
        exportFunction: "auth.controller.changepassword",
      });
      console.log("Error:", err);
      res.status(500).send({ message: "Error retrieving user" });
    });
};

exports.resetPassword = async (req, res) => {
  const { resetLink, newPass } = req.body;

  if (resetLink) {
    try {
      jwt.verify(resetLink, process.env.RESET_PASSWORD_KEY);
      const user = await User.findOne({ where: { resetLink: resetLink } });
      if (!user) {
        return res
          .status(400)
          .json({ error: "User with this token does not exist" });
      }
      const salt = await bcrypt.genSalt(3);
      const hashedPassword = await bcrypt.hash(newPass, salt);
      await user.update({
        password: hashedPassword,
        resetLink: null,
      });
      return res
        .status(200)
        .json({ message: "Your password has been changed" });
    } catch (err) {
      return res
        .status(401)
        .json({ error: "Incorrect token or it is expired" });
    }
  } else {
    return res.status(401).json({ error: "Authentication error!!!!" });
  }
};

exports.forgotPassword = async (req, res) => {
  const { user_email } = req.body;
  const { CLIENT_URL } = req.body; //CLIENT_URL will be fetch from the window location
  const admin_email = process.env.SMTP_USER; // admin email need to pass
  try {
    const user = await User.findOne({ where: { user_email } });
    console.log(user);
    if (!user) {
      // If user does not exist, send an email to admin
      let adminTransporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        secure: true,
        requireTLS: true,        
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      let adminMailOptions = {
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        subject: "Password Reset Request",
        html: `
          <p>A password reset request has been made for the email address ${user_email}, but no user with this email address was found in the database.</p>
          <p>Please investigate and take necessary action.</p>
        `,
      };

      await adminTransporter.sendMail(adminMailOptions);
      logger.info(
        "User with this email does not exist. An email has been sent to the admin for further action.",
        { exportFunction: "auth.controller.forgotPassword" }
      );
      return res.status(400).json({
        error:
          "User with this email does not exist. An email has been sent to the admin for further action.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.RESET_PASSWORD_KEY, {
      expiresIn: "20m",
    });

    let transporter = nodemailer.createTransport({
      service: process.env.SMTP_SERVICE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let mailOptions = {
      from: process.env.SMTP_USER,
      to: user_email,
      subject: "Reset Your Password",

      html: `
      <h2>Hi ${user.full_name},</h2>
        <h2>Please click on given link to reset your password</h2>
        <p>Reset link: ${CLIENT_URL}/resetpassword/${token}</p>
        <p>If you did not request this reset, please contact the admin immediately at ${admin_email}.</p>

      `,
    };

    await user.update({ resetLink: token });
    await transporter.sendMail(mailOptions);

    // Send email to admin to inform them about the password reset request
    let adminTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: true,
      requireTLS: true,      
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    let adminMailOptions = {
      from: process.env.SMTP_USER,
      to: process.env.SMTP_USER,
      subject: "Password Reset Request",
      html: `
        <p>A password reset request has been made for the email address ${user_email}.</p>
      `,
    };

    await adminTransporter.sendMail(adminMailOptions);
    logger.info("Email has been sent, kindly follow the instructions", {
      exportFunction: "auth.controller.forgotPassword",
    });
    return res.json({
      message: "Email has been sent, kindly follow the instructions",
    });
  } catch (err) {
    logger.info("Error selecting user from database", {
      exportFunction: "auth.controller.forgotPassword",
    });
    console.error(err);
    return res.status(400).json({
      error: "Error selecting user from database",
    });
  }
};
