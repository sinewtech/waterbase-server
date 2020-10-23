const express = require('express');
const { hash } = require('bcryptjs');
const Users = require('../models/Users');
const defaultError = require('../middlewares/defaultError');

const Auth = express.Router();
const SALT = parseInt(process.env.SALT_ROUNDS, 10) || 10;

// create one user
Auth.post('/', (req, res, next) => {
  const { body } = req;
  const { email, profile, password } = body;
  hash(password, SALT)
    .then((value) => {
      Users.create({ email, profile: profile || {}, password: value })
        .then((info) => {
          res.status(200).json({ success: true, ...info });
        })
        .catch((error) => {
          next(error);
        });
    })
    .catch((error) => {
      next(error);
    });
});

// update one user
Auth.put('/', (req, res, next) => {
  const { body } = req;
  const { where, document } = body;
  Users.findOne(where, (err) => {
    if (err) next(err);
    if (!document.password) {
      Users.updateOne(where, { $set: document })
        .then((data) => {
          res.status(200).json({ success: true, info: data });
        })
        .catch((error) => {
          next(error);
        });
    } else {
      hash(document.password, SALT)
        .then((value) => {
          Users.updateOne(where, { $set: { ...document, password: value } })
            .then((info) => {
              res.status(200).json({ success: true, ...info });
            })
            .catch((error) => {
              next(error);
            });
        })
        .catch((error) => {
          next(error);
        });
    }
  });
});

// get all users
Auth.get('/', (req, res, next) => {
  Users.find()
    .then((data) => {
      res.status(200).json({ success: true, users: data });
    })
    .catch((error) => {
      next(error);
    });
});

// get one user
Auth.get('/:id', (req, res, next) => {
  const { id } = req.params;
  Users.findOne({ _id: id })
    .then((data) => {
      res.status(200).json({ success: true, user: data });
    })
    .catch((error) => {
      next(error);
    });
});

// delete one user
Auth.delete('/', (req, res, next) => {
  const { body } = req;
  const { where } = body;
  Users.deleteOne(where)
    .then((data) => {
      res.status(200).json({ success: true, info: data });
    })
    .catch((error) => {
      next(error);
    });
});

Auth.use(defaultError);

module.exports = Auth;
