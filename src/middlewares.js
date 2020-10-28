/* eslint-disable no-unused-vars */
const defaultError = (err, _req, res, _next) => {
  res.status(500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const keyChecker = (req, res, next) => {
  if (process.env.API_KEY !== req.header('x-waterbase-key')) {
    const err = new Error('🔑 Not enough permission to access this API');
    res.status(500).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
  } else {
    next();
  }
};

const NotFound = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: '🔍 Could not find the resource you were looking',
  });
};

module.exports = { defaultError, keyChecker, NotFound };
