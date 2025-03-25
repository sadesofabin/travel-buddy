const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
};

const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Resource not found",
  });
};

const badRequestHandler = (message = "Bad Request") => (req, res, next) => {
  res.status(400).json({
    success: false,
    message,
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
  badRequestHandler,
};
