"use strict"

const AppClass = require('../app-class/app-class');
const User = require('../../models/User');
const { ObjectID } = require('bson');
const EmailService = require("../EmailService/emailService");
const ScheduleModel = require('../../models/schedule');
class Schedule extends AppClass {


    async addEvents_to_user_collection(eventId, participants = [], scheduleData) {



        for (let i = 0; i < participants.length; i++) {

            await ScheduleModel.updateOne({ _id: ObjectID(eventId) }, {
                $push:
                {
                    User_status: {
                        email: participants[i],
                        status: "Waiting"
                    }
                }
            })


            await User.updateOne({ email: participants[i] }, { $push: { events: { eventDetails: ObjectID(eventId) } } });
            EmailService.meetingNotification(participants[i], scheduleData)
        }
    }


    async deleteEvent_from_user_collection(eventId, participants = [], scheduleData) {

        for (let i = 0; i < participants.length; i++) {
            await User.updateOne({ email: participants[i] }, { $pull: { events: { eventDetails: eventId } } }, { new: true })
            EmailService.meetingCancelNotification(participants[i], scheduleData)

        }
    }

}

module.exports = new Schedule();