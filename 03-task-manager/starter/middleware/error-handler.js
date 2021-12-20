const { CustomAPIError } = require('../errors/custom-error');
/* eslint-disable no-unused-vars */
// eslint-disable-next-line arrow-body-style
const errorHandlerMiddleware = (err, req, res, next) => {
  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({ msg: err.message });
  }
  return res.status(err.status).json({ msg: err.message });
};

module.exports = errorHandlerMiddleware;
