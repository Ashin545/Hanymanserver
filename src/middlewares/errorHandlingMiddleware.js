// Custom error handler class
class ErrorResponse extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Error handling middleware
const errorHandler = (err, req, res, next) => {
  let error = { ...err };

  // Handle specific error types (like Mongoose Validation Errors, etc)
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message).join(', ');
    error = new ErrorResponse(message, 400);
  }

  // Handle MongoDB Duplicate Key Errors (e.g., for unique email)
  if (err.code === 11000) {
    const message = 'Duplicate field value entered';
    error = new ErrorResponse(message, 400);
  }

  // If we don't explicitly handle an error, it will default to this
  if (!error.statusCode) {
    error = new ErrorResponse('Server Error', 500);
  }

  // Log the error (you could also use a logging tool here like Winston or Morgan)
  console.error(err);

  // Send the error response
  res.status(error.statusCode).json({
    success: false,
    error: error.message || 'Server Error',
  });
};

module.exports = { errorHandler, ErrorResponse };
