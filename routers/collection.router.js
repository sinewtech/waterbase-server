const express = require('express');
const mongoose = require('mongoose');
const { connection } = require('../helpers/mongoUtil');
const defaultError = require('../middlewares/defaultError');

const Collections = express.Router();

// Create doc and or collection
Collections.post('/', (req, res, next) => {
  const { collection, object } = req.body;
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

// Get a doc by id and collection
Collections.get('/:collection/:doc', (req, res, next) => {
  const { collection, doc } = req.params;
  connection
    .collection(collection)
    .findOne({ _id: mongoose.Types.ObjectId(doc) })
    .then((value) => {
      res.status(200).json({ success: true, doc: value });
    })
    .catch(next);
});

// Query any collection for N docs
Collections.post('/query', (req, res, next) => {
  const { collection, query } = req.body;
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

Collections.use(defaultError);

module.exports = Collections;
