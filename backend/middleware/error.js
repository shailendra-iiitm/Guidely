const config = require("../config");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");

const errorHandler = (err, req, res, _next) => {
  console.error(err.message);
  const { message, statusCode } = err;

  res.status(statusCode || httpStatus.forbidden).json({
    success: "false",
    message: message,
    stack: config.env !== "production" ? err.stack : undefined,
  });
};



module.exports = {
  errorHandler
};
