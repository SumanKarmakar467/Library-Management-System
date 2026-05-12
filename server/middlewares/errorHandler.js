function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;

  if (process.env.NODE_ENV !== 'test') {
    console.error(err);
  }

  return res.status(status).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
}

module.exports = errorHandler;
