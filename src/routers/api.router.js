const express = require('express');
const Auth = require('./auth.router');
const Files = require('./files.router');
const Collections = require('./collection.router');
const FILES = process.env.FILES_FOLDER || 'uploads';

const api = express.Router();
api.use('/auth', Auth);
api.use('/files', Files);
api.use('/collections', Collections);
api.use(`/${FILES}`, express.static(FILES));

module.exports = api;
