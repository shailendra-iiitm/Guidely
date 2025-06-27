const config = require("../config");
const ApiError = require("../helper/apiError");
const httpStatus = require("../util/httpStatus");

const errorHandler = (err, req, res, _next) => {
  console.error("Error:", err);
  
  let error = { ...err };
  error.message = err.message;

  // Handle different types of errors
  if (err.name === 'CastError') {
    const message = 'Resource not found';
    error = new ApiError(httpStatus.notFound, message);
  }

  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ApiError(httpStatus.badRequest, message);
  }

  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = new ApiError(httpStatus.badRequest, message);
  }

  // Default to 500 server error
  if (!error.statusCode) {
    error.statusCode = httpStatus.internalServerError;
    error.message = err.message || 'Server Error';
  }

  res.status(error.statusCode).json({
    success: false,
    message: error.message,
    stack: process.env.NODE_ENV !== "production" ? err.stack : undefined,
  });
};

const notFound = (req, res, next) => {
  const error = new ApiError(
    httpStatus.notFound,
    `Not Found - ${req.originalUrl}`
  );
  next(error);
};

module.exports = {
  errorHandler,
  notFound
};
