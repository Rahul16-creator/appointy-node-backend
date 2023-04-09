const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String
    },
    password: {
        type: String
    },
    role: {
        type: String,
        enum: ["admin", "user"],
        default: "user"
    },
    isEnabled: {
        type: Boolean
    },
    verification: {
        type: String
    },
    otp: {
        type: String
    },
    otp_secret: {
        type: String
    },
    events: [
        {
            eventDetails: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Schedule"
            }
        }
    ]
}, { timestamps: true })

const User = mongoose.model("User", userSchema);

module.exports = User;
