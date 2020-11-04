const express = require('express');
const { hash } = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users.model');
const middlewares = require('../middlewares');

const Auth = express.Router();

Auth.use(middlewares.keyChecker);
const SALT = parseInt(process.env.SALT_ROUNDS, 10) || 10;

// create one user
Auth.post('/', (req, res, next) => {
  const { body } = req;
  const { email, profile, password } = body;
  hash(password, SALT)
    .then((value) => {
      Users.create({ email, profile: profile || {}, password: value })
        .then((value) => {
          const userValue = { email, profile: profile || {}, password: value };
          const accessToken = jwt.sign(userValue, process.env.JWT_ACCESS_TOKEN);
          res.status(201).json({ success: true, accessToken });
        })
        .catch(next);
    })
    .catch(next);
});

// update one user
Auth.put('/', (req, res, next) => {
  const { body } = req;
  const { where, user } = body;
  Users.findOne(where)
    .then((value) => {
      if (value !== null) {
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
      } else {
        const error = new Error('Was unable to get a user with that query');
        next(error);
      }
    })
    .catch(next);
});

// get all users
Auth.get('/', (req, res, next) => {
  Users.find()
    .then((data) => {
      if (value !== null) {
        res.status(200).json({ success: true, users: data });
      } else {
        const error = new Error('Was unable to get a user with that query');
        next(error);
      }
    })
    .catch(next);
});

// get one user
Auth.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Users.findOne({ _id: id })
    .then((data) => {
      if (data !== null) {
        res.status(200).json({ success: true, user: data });
      } else {
        const error = new Error('Was unable to get a user with that query');
        next(error);
      }
    })
    .catch(next);
});

// delete one user
Auth.delete('/', (req, res, next) => {
  const { body } = req;
  const { where } = body;
  Users.deleteOne(where)
    .then((data) => {
      if (data.n !== 0) {
        res.status(200).json({ success: true, info: data });
      } else {
        const error = new Error('Was unable to get a user with that query');
        next(error);
      }
    })
    .catch(next);
});

Auth.post('/login', (req, res, next) => {});

Auth.use(middlewares.defaultError);

module.exports = Auth;
