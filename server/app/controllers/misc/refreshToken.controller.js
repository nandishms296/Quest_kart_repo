const db = require("../../models");
const User  = db.configModels.tbl_user;
const Op = db.Sequelize.Op;
const logger = require('../../config/logger');

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Login function will expect login_id and password. On successful password match, it will return a JWT token.
exports.handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) res.sendStatus(401);
    console.log("cookie.jwt : ",cookies.jwt);
    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ where : {refresh_token : refreshToken }});
    if (!foundUser)
    {
        logger.info("unauthorized",{exportFunction: "refreshToken.controller.handleRefreshToken"});
        return res.sendStatus(403); // Unauthorized  
    }
     

    jwt.verify( refreshToken, process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.login_id !== decoded.login_id) return res.sendStatus(403); //Invalid Token
            console.log("decoded: ", decoded);
            const accessToken = jwt.sign(
                {"login_id": decoded.login_id},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '30s'}
            );
            res.json({accessToken});
        }
    );
    
};