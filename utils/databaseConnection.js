const mongoose = require("mongoose");
const config = require("../config/index");

mongoose.connect(`${config.mongoUrl}/${config.dbName}`, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, (err, res) => {
    if (err) {
        console.log("Database Connection failed")
        return;
    }
    console.log("Database connected!!")
})

