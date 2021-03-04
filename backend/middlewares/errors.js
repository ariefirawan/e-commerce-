const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.statusCode).json({
      success: false,
      message: err,
      errMssage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === 'PRODUCTION') {
    let error = { ...err };

    error.message = err.message;

    // Wrong mongoose object ID error
    if (err.name === 'CastError') {
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400);
    }

    // Handling mongoose Validation error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map((value) => value.message);
      error = new ErrorHandler(message, 400);
    }

    // Handling wrong jwt error
    if (err.name === 'JsonWebTokenError') {
      const message = `Json Web Token is invalid, Try again!!`;
      error = new ErrorHandler(message, 400);
    }

    // Handling expired jwt error
    if (err.name === 'TokenExpiredError') {
      const message = `Json Web Token is Expired, Try again!!`;
      error = new ErrorHandler(message, 400);
    }

    // Handling mongoose duplicate user
    if (err.code === 11000) {
      const message = `User ${Object.keys(err.keyValue)} is already exists`;
      error = new ErrorHandler(message, 400);
    }

    res.status(err.statusCode).json({
      success: false,
      message: err.message || 'Internal server Error',
    });
  }
};
