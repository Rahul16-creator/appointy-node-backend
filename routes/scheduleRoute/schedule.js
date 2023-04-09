const scheduleModel = require("../../models/schedule")
const express = require("express");
const router = express.Router();
const ScheduleService = require("../../service/schedule/Schedule");
const { ObjectID } = require("bson");
const errorCodes = require("../../service/ErrorCodes/errorcodes");
const { AuthMiddleware } = require("../../utils/auth");
const moment = require("moment");

router.post('/schedule/insert', AuthMiddleware, async (req, res, next) => {

    const eventName = req.body.eventName
    const description = req.body.description
    const organizer = req.body.organizer
    const meetURL = req.body.meetURL
    let participants = req.body.participants;
    participants = [...participants, organizer]

    const startData = req.body.startTime;
    const endData = req.body.endTime;
    const eventDate = req.body.eventDate;

    const startTime = startData
    const endTime = endData
    const Dates = eventDate

    // console.log(new Date(`${Dates} ${startTime}`).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }), new Date(`${Dates} ${endTime}`).toLocaleString("en-US", { timeZone: "Asia/Kolkata" }), eventDate)


    const schedule = new scheduleModel({
        title: eventName,
        description: description,
        organizer: organizer,
        startTime: startTime,
        endTime: endTime,
        eventDate: Dates,
        meetURL: meetURL,
        startDate: moment(new Date(`${Dates} ${startTime}`), 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('MM/DD/YYYY, h:mm:ss A'),
        endDate: moment(new Date(`${Dates} ${endTime}`), 'YYYY-MM-DD[T]HH:mm:ss.SSS[Z]').format('MM/DD/YYYY, h:mm:ss A'),
        participants
    })

    console.log(participants)


    try {
        const scheduleData = await schedule.save();

        ScheduleService.addEvents_to_user_collection(scheduleData._id, scheduleData.participants, scheduleData)

        res.send({ status: true, message: "Event Scheduled Successfully!!" })

    } catch (error) {
        res.status(400).send(errorCodes["SCHEDULE_ADD_ERROR"]);
    }
})

router.get('/schedule/read', AuthMiddleware, async (req, res, next) => {
    scheduleModel.find({}, (err, result) => {
        if (err) {
            res.send(err)
        }
        res.send(result)
    })
})

router.put('/schedule/update', AuthMiddleware, async (req, res, next) => {
    const id = req.body.id;
    const neweventName = req.body.neweventName
    const newdescription = req.body.newdescription
    const neworganizer = req.body.neworganizer
    const newstartDate = req.body.newstartDate
    const newendDate = req.body.newendDate
    const newtime = req.body.newtime
    const newmeetURL = req.body.newmeetURL
    const newshareURL = req.body.newshareURL


    try {
        scheduleModel.findById(id, (error, updated_schedule) => {
            updated_schedule.eventName = neweventName
            updated_schedule.description = newdescription
            updated_schedule.organizer = neworganizer
            updated_schedule.startDate = newstartDate
            updated_schedule.endDate = newendDate
            updated_schedule.time = newtime
            updated_schedule.meetURL = newmeetURL
            updated_schedule.shareURL = newshareURL

        })
    } catch (error) {
        console.log(error)
    }
})

router.delete("/schedule/delete/:id", AuthMiddleware, async (req, res) => {
    const id = req.params.id;
    const scheduleData = await scheduleModel.findOne({ _id: ObjectID(id) });

    ScheduleService.deleteEvent_from_user_collection(id, scheduleData.participants, scheduleData)

    await scheduleModel.findByIdAndRemove(id).exec()

    res.send({
        status: true,
        message: "Event deleted Successfully!!"
    })

})

module.exports = router