const ErrorHandler = require('../utils/errorHandler');

module.exports = (err, req, res, next) => {
  err.errorCode = err.errorCode || 500;
  err.message = err.message || 'Internal Server Error';

  if (process.env.NODE_ENV === 'DEVELOPMENT') {
    res.status(err.errorCode).json({
      success: false,
      error: err,
      errMssage: err.message,
      stack: err.stack,
    });
  }

  if (process.env.NODE_ENV === 'PRODUCTION') {
    let error = { ...err };

    error.message = err.message;

    // Wrong mongoose object ID error
    if(err.name === 'CastError'){
      const message = `Resource not found. Invalid: ${err.path}`;
      error = new ErrorHandler(message, 400)
    }

    // Handling mongoose Validation error
    if(err.name === 'ValidationError'){
      const message= Object.values(err.errors).map(value => value.message)
      error = new ErrorHandler(message, 400)
    }

    res.status(error.errorCode).json({
      success: false,
      error: error.message || 'Internal server Error',
    });
  }
};
