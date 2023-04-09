"use strict"

const crypto = require("crypto");
const User = require("../../models/User");
const sendMailer = require("../../utils/email_sender");
const AppError = require("../AppError/AppError");
const errorCodes = require("../ErrorCodes/errorcodes");
const otpGenerate = require("../../utils/otp_generater");
const AppClass = require("../app-class/app-class");
const ejs = require("ejs");
const path = require("path");
const momentTimeZone = require("moment-timezone");

class EmailService extends AppClass {


    async signupMailVerification(email, randmString) {
        var link = `https://appointy-backend.herokuapp.com/api/v1/account_verification/${randmString}`;
        const subject = "Account Verification";
        const contentMessage = await ejs.renderFile(path.join(__dirname, '../../views/email_verify.ejs'), { link })
        if (sendMailer(email, subject, contentMessage)) return true;
        return false;
    }

    generateRandomString() {
        const id = crypto.randomBytes(20).toString('hex');
        return id;
    }


    async accountVerification(verifyId, res) {
        const verification_id = verifyId.id;
        const user_data = await User.findOne({ verification: verification_id });

        if (!user_data) {
            throw new AppError(errorCodes["VERIFICATION_ID_NOT_FOUND"]);
        }

        if (user_data.isEnabled) {
            return res.render('./already_verified')
        }

        try {
            await User.updateOne({ _id: user_data._id }, { $set: { isEnabled: true } });
            return res.render('./verifySuccess', { Name: `${user_data.name || 'User'}` })
        }
        catch (err) {
            throw new AppError(errorCodes["VERIFICATION_FAILED"]);
        }
    }

    async generateOtp(requestData) {
        const { email } = requestData

        const existData = await this.accountExistCheck(email);
        if (!existData) throw new AppError(errorCodes['EMAIL_ID_NOT_FOUND']);

        if (!existData.isEnabled) throw new AppError(errorCodes["EMAIL_NOT_VERIFIED"]);

        const otpData = otpGenerate();
        const html = await ejs.renderFile(path.join(__dirname, '../../views/otp_verification.ejs'), { otpData })

        const subject = "Forgot password";
        if (!sendMailer(email, subject, html)) throw new AppError(errorCodes["UNKNOWN_ERROR"]);


        try {
            await User.updateOne({ email }, { $set: { otp: otpData.otp, otp_secret: otpData.secret } })
            return {
                status: true,
                status_code: 201,
                message: "OTP sent to your registered mail-ID !!"
            }
        }
        catch (err) {
            throw new AppError(errorCodes["UNKNOWN_ERROR"])
        }
    }


    async accountExistCheck(email) {
        const response = await User.findOne({ email });
        if (response) {
            return response;
        }

        return false;
    }


    loginVerification(email, deviceName, ip) {
        const subject = "Successfull log-in from new device";

        const templateData = {
            ip: ip,
            timestamp: momentTimeZone().tz("Asia/Kolkata").format("MMMM Do YYYY, h:mm:ss a"),
            device: deviceName,
            email: email
        }

        ejs.renderFile(path.join(__dirname, '../../views/login_confirm.ejs'), { templateData }, (err, html) => {
            if (err) console.log("login mail html errror");
            sendMailer(email, subject, html);
        })

    }


    async meetingNotification(email, scheduleData) {


        const randmString = crypto.randomBytes(20).toString('hex')


        const AcceptLink = `https://appointy-backend.herokuapp.com/api/v1/add_notification/${email}/${scheduleData._id}/${randmString}`;
        const DeclineLink = `https://appointy-backend.herokuapp.com/api/v1/delete_notification/${email}/${scheduleData._id}/${randmString}`;

        const subject = `Invitation :  ${scheduleData.title} @ ${scheduleData.eventDate} ( ${email} )`;
        const html = await ejs.renderFile(path.join(__dirname, '../../views/meet_notify.ejs'), { scheduleData, AcceptLink, DeclineLink })
        sendMailer(email, subject, html);
    }

    async meetingCancelNotification(email, scheduleData) {

        const subject = `Cancelled :  ${scheduleData.title} @ ${scheduleData.eventDate} ( ${email} )`;
        const html = await ejs.renderFile(path.join(__dirname, '../../views/cancel_notify.ejs'), { scheduleData })
        sendMailer(email, subject, html);
    }

}

module.exports = new EmailService();
