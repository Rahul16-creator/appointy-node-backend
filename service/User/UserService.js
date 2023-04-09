"use strict"

const bcrypt = require("bcrypt");
const User = require("../../models/User");
const errorCodes = require("../ErrorCodes/errorcodes");
const AppError = require('../AppError/AppError');
const jwt = require("jsonwebtoken");
const { secret } = require("../../config/index");
const EmailService = require("../EmailService/emailService");
const AppClass = require("../app-class/app-class");
const otplib = require("otplib");
const _ = require("lodash");

class UserService extends AppClass {

    async fetchAllUser() {

        try {
            const users = await User.find({ role: "user" }).populate("events.eventDetails");
            return {
                status: true,
                status_code: 201,
                message: "data fetched successfully!!",
                response_data: {
                    data: users
                }
            }
        }
        catch (err) {
            throw new AppError(errorCodes["USR_FETCH_ERROR"]);
        }

    }

    async addUser(requsetData) {

        const { name, email, password, confirm_password, role } = requsetData;
        this.confirmPasswordCheck(password, confirm_password);
        if (await this.accountExistCheck(email)) throw new AppError(errorCodes["EMAIL_ID_ALREADY_EXIT"]);

        const hashPassword = await this.passwordHash(requsetData.password);


        // generateRandomString
        const randomString = EmailService.generateRandomString();


        const userData = new User({
            name,
            email,
            password: hashPassword,
            role: role,
            verification: randomString,
            isEnabled: false
        })

        //    account verification ..
        EmailService.signupMailVerification(email, randomString);

        // try {
        await userData.save();

        return {
            status: true,
            status_code: 201,
            message: "SignIn Successfull please check verify the mail!!"
        }
        // }
        // catch (err) {
        //     throw new AppError(errorCodes["USR_SAVE_ERROR"]);
        // }
    }

    async login(requestData, ip, header) {

        const { email, password } = requestData;
        const existData = await this.accountExistCheck(email);

        if (!existData) throw new AppError(errorCodes["EMAIL_ID_NOT_FOUND"]);

        if (existData && !existData.isEnabled) throw new AppError(errorCodes["EMAIL_NOT_VERIFIED"]);

        if (! await this.passwordMatch(password, existData.password)) throw new AppError(errorCodes["PASSWORD_WRONG"]);

        const token = jwt.sign({ id: existData._id }, secret, { expiresIn: "1 days" });

        // deveice-name
        EmailService.loginVerification(email, header, ip);
        delete existData['password'];


        const newResponseData = _.omit(existData, "password")

        return {
            status: true,
            status_code: 201,
            message: "Login Successfull!",
            response_data: {
                token: token,
                user_data: newResponseData
            }
        }


    }

    async passwordHash(password) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);
        return hashPassword;
    }

    confirmPasswordCheck = (pass, confPass) => {
        if (pass != confPass) {
            throw new AppError(errorCodes["PASSWORD_MISMATCH"]);
        }
    }

    async accountExistCheck(email) {
        const response = await User.findOne({ email }).populate("events.eventDetails");
        if (response) {
            return response;
        }

        return false;
    }

    async passwordMatch(password, hashPassword) {
        const response = await bcrypt.compare(password, hashPassword);
        return response;
    }

    async forgotPassword(requestData) {

        const { otp, password } = requestData;

        const existData = await User.findOne({ otp });
        if (!existData) throw new AppError(errorCodes["OTP_WRONG"])

        if (!this.validateOtp(otp, existData.otp_secret)) throw new AppError(errorCodes["OTP_EXPIRED"]);

        const hashPassword = await this.passwordHash(password);

        try {
            await User.updateOne({ email: existData.email }, { $set: { password: hashPassword } })
            return {
                status: true,
                status_code: 201,
                message: "password updated successfully!!"
            }
        }
        catch (err) {
            throw new AppError(errorCodes["UNKNOWN_ERROR"]);
        }

    }

    validateOtp(otp, secret) {
        return otplib.authenticator.check(otp, secret)
    }

    async changePassword(requestData) {

        const { email, newPassword } = requestData;
        const newHashedPassword = await this.passwordHash(newPassword);

        const existData = await this.accountExistCheck(email);
        if (!existData) throw new AppError(errorCodes["EMAIL_ID_NOT_FOUND"]);

        try {
            const data = await User.updateOne({ email }, { $set: { password: newHashedPassword } });
            console.log(data)
            return {
                status: true,
                status_code: 201,
                message: "password changed successfully!!"
            }
        }
        catch (err) {
            throw new AppError(errorCodes["CHANGE_PASSWORD_ERROR"]);
        }
    }


    checkStatus(data = [], email) {
        let status = "";
        data.forEach((value) => {
            if (value.email == email) {
                status = value.status;
            }
        })
        return status;
    }


}

module.exports = new UserService();
