"use strict"

const nodemailer = require("nodemailer");
const { AppointyEmail: FROM_MAIL, AppointyEmailPAssword: EMAIL_PASSWORD } = require("../config/index");


module.exports = async (to, subject, content) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: FROM_MAIL,
                pass: EMAIL_PASSWORD
            }
        });

        let info = await transporter.sendMail({
            from: `${FROM_MAIL}`,
            to: to,
            subject: subject,
            html: content,
        });
        console.log("MAIL_success");
    } catch (error) {
        console.log(error)
        console.log("MAIL_error");
    }
}


// const sgMail = require("@sendgrid/mail");
// sgMail.setApiKey(sendGrid);

// module.exports = async function (toEmail, subject, msg) {
//     const mailrequest = {
//         to: toEmail,
//         from: FROM_MAIL,
//         subject: subject,
//         html: msg
//     }
//     sgMail.send(mailrequest).then(() => console.log("success")).catch(() => console.log("error"))

// }

