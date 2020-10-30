const express = require('express');
const path = require('path');
const Auth = require('./auth.router');
const Storage = require('./storage.router');
const Collections = require('./collection.router');
const FILES = process.env.FILES_FOLDER || 'uploads';

const api = express.Router();
api.use('/auth', Auth);
api.use('/storage', Storage);
api.use('/database', Collections);
api.use(`/${FILES}`, express.static(FILES));

module.exports = api;
