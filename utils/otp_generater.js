"use strict"

const otplip = require("otplib");

module.exports = function () {
    otplip.authenticator.options = {
        step: 300,
        digits: 6
    }
    let secret = otplip.authenticator.generateSecret();
    let otp = otplip.authenticator.generate(secret);

    return {
        otp, secret
    }
}
