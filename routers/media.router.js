const express = require('express');

const defaultError = require('../middlewares/defaultError');

const Media = express.Router();

Media.use(defaultError);

module.exports = Media;
