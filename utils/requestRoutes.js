
const errorCodes = require("../service/ErrorCodes/errorcodes");

const requestRoutes = function (method, ...args) {
    return function (req, res, next) {

        if (!req.locals) {
            req.locals = {};
        }
        method(...args)
            .then((response) => {
                if (response) {
                    req.locals.data = response;
                }
                next();
            })
            .catch((error) => {

                const msg_formt = {
                    status: error.status || false,
                    message: error.message || errorCodes["UNKNOWN_ERROR"],
                    status_code: error.status_code || 500
                }

                req.locals.err = true;
                req.locals.data = msg_formt;

                next();
            })
    }
}

module.exports = requestRoutes;


/*

 if (response.status == false) {
                        req.locals.err = true;
                        const msg_formt = {
                            status: response.status || false,
                            message: errorCodes[response.message],
                            status_code: response.status_code || 500
                        }
                        req.locals.data = msg_formt;
                    }
                    else {
                        req.locals.data = response;
                    }

*/