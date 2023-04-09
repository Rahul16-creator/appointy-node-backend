const jwt = require("jsonwebtoken");
const errorCodes = require("../service/ErrorCodes/errorcodes");
const { secret } = require("../config/index");
const User = require("../models/User");

const AuthMiddleware = async (req, res, next) => {

    req.user = await headerValidation(req, res, next);

    if (req.user.role !== "admin") return res.status(403).send(errorCodes["ACCESS_DENIED"]);
    next();
}

const UserMiddleware = async (req, res, next) => {
    req.user = await headerValidation(req, res, next);
    next();
}

const headerValidation = async (req, res, next) => {

    try {

        const token = req.header('authorization');
        if (!token) return res.status(404).send(errorCodes["TOKEN_MISSING"]);

        const is_valid = await jwt.verify(token, secret);

        const user_detail = await User.findOne({ _id: Object(is_valid.id) });
        return user_detail;

    }
    catch (err) {
        return res.status(404).send(errorCodes["TOKEN_INVALID"])
    }
}

module.exports = {
    AuthMiddleware,
    UserMiddleware
};