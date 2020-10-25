const NotFound = (req, res, next) => {
  console.log(req);
  res.status(404).json({
    success: false,
    message: '🔍 Could not find the resource you were looking',
  });
};

module.exports = NotFound;
