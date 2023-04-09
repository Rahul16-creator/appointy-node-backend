require("dotenv").config();

const config = {
    mongoUrl: process.env.MONGO_URL,
    dbName: process.env.DB_NAME,
    secret: process.env.SECRET,
    AppointyEmail: process.env.APPOINTY_MAIL,
    AppointyEmailPAssword: process.env.APPOINTY_MAIL_PASSWORD
}

module.exports = config;