/* eslint-disable no-unused-vars */
const defaultError = (err, _req, res, _next) => {
  res.status(500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

module.exports = defaultError;
