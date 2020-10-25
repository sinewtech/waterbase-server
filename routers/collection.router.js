const express = require('express');
const mongoose = require('mongoose');
const { connection } = require('../helpers/mongoUtil');
const defaultError = require('../middlewares/defaultError');
const { collection } = require('../models/Users.model');

const Collections = express.Router();

// Create doc and or collection
Collections.post('/:collection', (req, res, next) => {
  const { collection } = req.params;
  const { object } = req.body;
  connection
    .collection(collection)
    .insertOne(object)
    .then((info) => {
      res.status(200).json({ success: true, ...info.result });
    })
    .catch(next);
});

// Get all docs in a collection
Collections.get('/:collection', (req, res, next) => {
  const { collection } = req.params;
  connection
    .collection(collection)
    .find()
    .toArray()
    .then((value) => {
      res.status(200).json({ success: true, docs: value });
    })
    .catch(next);
});

// Query any collection for N docs
Collections.post('/query/:collection', (req, res, next) => {
  const { collection } = req.params;
  const { query } = req.body;
  if (query._id && mongoose.isValidObjectId(query._id))
    query._id = new mongoose.Types.ObjectId(query._id);
  connection
    .collection(collection)
    .find(query)
    .toArray()
    .then((value) => {
      res.status(200).json({ success: true, docs: value });
    })
    .catch(next);
});

Collections.delete('/delete/:collection', (req, res, next) => {
  const { collection } = req.params;
  const { query } = req.body;
  if (query._id && mongoose.isValidObjectId(query._id))
    query._id = new mongoose.Types.ObjectId(query._id);
  connection
    .collection(collection)
    .deleteMany(query)
    .then((value) => {
      res.status(200).json({ success: true, info: value });
    })
    .catch(next);
});

Collections.put('/update/:collection', (req, res, next) => {
  const { collection } = req.params;
  const { query, update } = req.body;
  if (query._id && mongoose.isValidObjectId(query._id))
    query._id = new mongoose.Types.ObjectId(query._id);
  connection
    .collection(collection)
    .findOneAndUpdate(query, update)
    .then((value) => {
      res.status(200).json({ success: true, info: value });
    })
    .catch(next);
});

Collections.use(defaultError);

module.exports = Collections;
