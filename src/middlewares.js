/* eslint-disable no-unused-vars */
const defaultError = (err, _req, res, _next) => {
  res.status(500).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
  });
};

const crypto = require('crypto');
const keyChecker = (req, res, next) => {
  if (
    !crypto.timingSafeEqual(
      Buffer.from(process.env.API_KEY),
      Buffer.from(req.header('x-waterbase-key')),
    )
  ) {
    const err = new Error('🔑 Not enough permission to access this API');
    res.status(401).json({
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
