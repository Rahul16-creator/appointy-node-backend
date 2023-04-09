const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const cors = require("cors");
const _ = require("lodash");
require("./utils/databaseConnection");

// Routes import
const userRouter = require("./routes/User");
const scheduleRouter = require("./routes/scheduleRoute/schedule");


const port = process.env.PORT || 8080;

const app = express();


app.set('view engine', 'ejs')
app.set('views', 'views')

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(morgan("dev"));
app.use("/api/v1", userRouter);
app.use("/api/v1", scheduleRouter)

// Schema Validation and Global Error
app.use((err, req, res, next) => {
    if (err.name == "JsonSchemaValidationError") {

        let errorMessage = "";
        if (err.validationErrors.query) {
            errorMessage = _.map(err.validationErrors.query, "message").join(", ");
        }
        else if (err.validationErrors.params) {
            errorMessage = _.map(err.validationErrors.params, "message").join(", ");
        }
        else {
            errorMessage = _.map(err.validationErrors.body, "message").join(", ")
        }

        return res.status(400).send({
            status: false,
            message: errorMessage
        })

    }
    else {
        return res.status(500).send({
            status: false,
            message: err.message || "Internal Server Error"
        })
    }
})

// Route Not Found!!
app.use((req, res, next) => {
    res.status(404).send({
        status: false,
        message: "page not found!"
    })
})

app.listen(port, () => {
    console.log(`Application running in an  ${port} port`)
})
