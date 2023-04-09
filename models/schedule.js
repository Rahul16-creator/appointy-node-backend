const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    organizer: {
        type: String,
        required: true
    },
    startTime: {
        type: String,
        required: true
    },
    endTime: {
        type: String,
        required: true
    },
    startDate: {
        type: String,
        required: true
    },
    endDate: {
        type: String,
        required: true
    },
    eventDate: {
        type: String,
        required: true
    },
    meetURL: {
        type: String,
        required: true
    },
    participants: {
        type: Array,
        required: true
    },

    User_status: [
        {
            email: String,
            status: {
                type: String,
                default: "Waiting"
            }

        }
    ]
}, { timestamps: true })

const schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = schedule;
