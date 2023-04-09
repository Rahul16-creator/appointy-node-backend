"use Strict";

const express = require("express");
const router = express.Router();

const { userSignupSchema, loginSchema } = require("./validation/userValidation");
const Validator = require("express-json-validator-middleware").Validator;
const validator = new Validator({ allErrors: true });
const validate = validator.validate;
const UserService = require("../service/User/UserService");
const reqHandler = require("../utils/requestRoutes");
const resHandler = require("../utils/responseRoutes");
const { AuthMiddleware } = require("../utils/auth");
const EmailService = require("../service/EmailService/emailService");
const ErrorCodes = require("../service/ErrorCodes/errorcodes");
const mongoose = require("mongoose");
const User = require("../models/User");
const ScheduleModel = require("../models/schedule");
const { ObjectID } = require('bson');
const AppError = require("../service/AppError/AppError");



router.get("/fetchUsers",
    AuthMiddleware,
    (req, res, next) => reqHandler(UserService.fetchAllUser)(req, res, next),
    resHandler
);

router.post("/signup", validate({ body: userSignupSchema }),
    (req, res, next) => reqHandler(UserService.addUser, req.body)(req, res, next),
    resHandler
)

router.post("/login", validate({ body: loginSchema }),
    (req, ...args) => reqHandler(UserService.login, req.body, req.ip, req.headers['user-agent'])(req, ...args),
    (req, res, next) => {
        next();
    },
    resHandler
)

router.get('/account_verification/:id',
    async (req, res, next) => {

        const verification_id = req.params.id
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

)

router.post('/generate_otp',
    (req, res, next) => reqHandler(EmailService.generateOtp, req.body)(req, res, next),
    resHandler
)

// forgot password 
router.post("/forgot_password",
    (req, ...args) => reqHandler(UserService.forgotPassword, req.body)(req, ...args),
    resHandler
)

//FetchID
router.get("/fetch_user_id/:id", async (req, res, next) => {
    const id = req.params.id;
    try {

        const response = await await User.findOne({ _id: mongoose.Types.ObjectId(id) }).populate("events.eventDetails")
        res.status(200).send({ status: true, message: "data fetched successfully", response })
    }
    catch {
        res.status(400).send(ErrorCodes["USER_DOES_NOT_EXIST"])
    }

})

//update_user_data
router.patch("/update_user_id/:id", async (req, res, next) => {
    try {
        const singleUser = await User.findById(req.params.id)
        singleUser.name = req.body.name
        const display = await singleUser.save()
        res.json(display)
    } catch (error) {
        res.send("error")
    }
})

router.post("/changePassword", (req, res, next) => reqHandler(UserService.changePassword, req.body)(req, res, next), resHandler);

// schedule Accept
router.get("/add_notification/:user_email/:event_id/:randomtext", async (req, res, next) => {

    try {

        const data = await ScheduleModel.findOne(
            { _id: ObjectID(req.params.event_id), 'User_status.email': req.params.user_email })

        if (UserService.checkStatus(data.User_status, req.params.user_email) == "Declined") {
            res.render('./already_declined.ejs');
        }

        if (UserService.checkStatus(data.User_status, req.params.user_email) == "Accepted") {
            res.render('./already_booked.ejs');
        }
        await ScheduleModel.updateOne(
            { _id: ObjectID(req.params.event_id), 'User_status.email': req.params.user_email },
            { $set: { "User_status.$.status": "Accepted" } }
        )
        res.render('./email_accept.ejs');
    }
    catch (err) {
        res.status(404).send({ status: false, message: "meeting confirmed Failed!!" });
    }

})

// schedule Decline
router.get("/delete_notification/:user_email/:event_id/:randomtext", async (req, res, next) => {
    try {

        const data = await ScheduleModel.findOne(
            { _id: ObjectID(req.params.event_id), 'User_status.email': req.params.user_email })

        if (UserService.checkStatus(data.User_status, req.params.user_email) == "Declined") {
            res.render('./already_declined.ejs');
        }

        await ScheduleModel.updateOne(
            { _id: ObjectID(req.params.event_id), 'User_status.email': req.params.user_email },
            { $set: { "User_status.$.status": "Declined" } }
        )
        await User.updateOne({ email: req.params.user_email }, { $pull: { events: { eventDetails: ObjectID(req.params.event_id) } } }, { new: true })
        res.render('./email_decline.ejs');
    }
    catch (err) {
        res.status(404).send({ status: false, message: "meeting Declined Failed!!" });
    }
})


module.exports = router;
