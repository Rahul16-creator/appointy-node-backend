
module.exports = function (req, res, next) {
    const { status, status_code, message, response_data } = req.locals.data;
    return res.status(status_code).send({ status, message, response_data });
}