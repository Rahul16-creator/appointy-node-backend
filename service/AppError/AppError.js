"use strict";

const ExtendableError = require("es6-error");

class AppError extends ExtendableError {
    constructor({ status, message }) {
        super(message);
        this.status = status || false;
        this.message = message || "Something Server Error!!"
    }
}

module.exports = AppError;