const express = require('express');
const { hash } = require('bcryptjs');
const Users = require('../models/Users.model');
const middlewares = require('../middlewares');

const Auth = express.Router();
const SALT = parseInt(process.env.SALT_ROUNDS, 10) || 10;

// create one user
Auth.post('/', (req, res, next) => {
  const { body } = req;
  const { email, profile, password } = body;
  hash(password, SALT)
    .then((value) => {
      Users.create({ email, profile: profile || {}, password: value })
        .then((value) => {
          res.status(200).json({ success: true, ...value.toObject() });
        })
        .catch(next);
    })
    .catch(next);
});

// update one user
Auth.put('/', (req, res, next) => {
  const { body } = req;
  const { where, user } = body;
  Users.findOne(where, (err) => {
    if (err) next(err);
    if (!user.password) {
      Users.updateOne(where, { $set: user })
        .then((value) => {
          res.status(200).json({ success: true, info: value });
        })
        .catch(next);
    } else {
      hash(user.password, SALT)
        .then((value) => {
          Users.updateOne(where, { $set: { ...user, password: value } })
            .then((value) => {
              res.status(200).json({ success: true, ...value.toObject() });
            })
            .catch(next);
        })
        .catch(next);
    }
  });
});

// get all users
Auth.get('/', (req, res, next) => {
  Users.find()
    .then((data) => {
      res.status(200).json({ success: true, users: data });
    })
    .catch(next);
});

// get one user
Auth.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Users.findOne({ _id: id })
    .then((data) => {
      res.status(200).json({ success: true, user: data });
    })
    .catch(next);
});

// delete one user
Auth.delete('/', (req, res, next) => {
  const { body } = req;
  const { where } = body;
  Users.deleteOne(where)
    .then((data) => {
      res.status(200).json({ success: true, info: data });
    })
    .catch(next);
});

Auth.use(middlewares.defaultError);

module.exports = Auth;
