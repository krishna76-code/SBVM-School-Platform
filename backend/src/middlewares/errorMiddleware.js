const errorMiddleware = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      error: err,
      stack: err.stack
    });
  } else {
    // Production Mode: Hide sensitive stack details
    if (err.isOperational) {
      // Handled operational error (e.g. login incorrect, validation failed)
      res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
    } else {
      // Unhandled programming error (e.g. library crash, db disconnected)
      console.error('ERROR 💥:', err);
      res.status(500).json({
        status: 'error',
        message: 'Something went wrong on our end.'
      });
    }
  }
};

export default errorMiddleware;
