const db = require("../../models");
const User  = db.configModels.tbl_user;
const Op = db.Sequelize.Op;
const logger = require('../../config/logger');
  
exports.handleLogout = async (req, res) => {
    // On Client, also delete the accessToken
    
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStats(204); // No content

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ where : {refresh_token : refreshToken }});
    if (!foundUser) {
        logger.info("unauthorized",{exportFunction: "logout.controller.handleLogout"});
        req.clearCookie('jwt', { httpOnly: true});
        return res.sendStatus(204); // Unauthorized
    }

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
        refresh_token: ''
    }
    console.log("CurrentUser: ", currentUser);
    const num = await User.update(currentUser, {
        where: {id : currentUser.id }
    });
    console.log("Record Updated : ", num);
    logger.info("authorized",{exportFunction: "logout.controller.handleLogout"});
    res.clearCookie('jwt', { httpOnly: true , sameSite: 'None', secure: true }); //secure : true - only serves on https
    res.sendStatus(204);
};