const express = require('express');
const Users = require('../models/Users');

const Auth = express.Router();
// create one user
Auth.post('/', (req, res) => {
  const { body } = req;
  Users.create({ ...body })
    .then((info) => {
      res.status(200).json({ success: true, ...info });
    })
    .catch((error) => {
      res.status(500).json({ success: false, ...error });
    });
});

// update one user
Auth.put('/', (req, res) => {
  const { body } = req;
  const { where, document } = body;
  Users.updateOne(where, { $set: document })
    .then((data) => {
      res.status(200).json({ success: true, info: data });
    })
    .catch((error) => {
      res.status(500).json({ success: false, ...error });
    });
});

// get all users
Auth.get('/', (req, res) => {
  Users.find()
    .then((data) => {
      res.status(200).json({ success: true, users: data });
    })
    .catch((error) => {
      res.status(500).json({ success: false, ...error });
    });
});

// get one user
Auth.get('/:id', (req, res) => {
  const { id } = req.params;
  Users.findOne({ _id: id })
    .then((data) => {
      res.status(200).json({ success: true, user: data });
    })
    .catch((error) => {
      res.status(500).json({ success: false, ...error });
    });
});

// delete one user
Auth.delete('/', (req, res) => {
  const { body } = req;
  const { where } = body;
  Users.deleteOne(where)
    .then((data) => {
      res.status(200).json({ success: true, info: data });
    })
    .catch((error) => {
      res.status(500).json({ success: false, ...error });
    });
});

module.exports = Auth;
