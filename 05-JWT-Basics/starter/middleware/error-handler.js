const CustomAPIError = require('../errors/custom-error');

// eslint-disable-next-line no-unused-vars
const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof CustomAPIError) {
        return res.status(err.statusCode).json({ msg: err.message });
    }
    return res.status(500).send('Something went wrong try again later');
};

module.exports = errorHandlerMiddleware;
