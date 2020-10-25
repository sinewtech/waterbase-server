const keyChecker = (req, res, next) => {
  if (process.env.API_KEY !== req.header('X-waterbase-key')) {
    const err = new Error('Not enough permission to access this API');
    res.status(500).json({
      success: false,
      message: err.message,
      stack: process.env.NODE_ENV === 'production' ? '🥞' : err.stack,
    });
  } else {
    next();
  }
};

module.exports = keyChecker;
