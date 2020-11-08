const express = require('express');
const { hash, compareSync } = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Users = require('../models/Users.model');
const middlewares = require('../middlewares');
const RefreshTokens = require('../models/RefreshTokens.model');

const Auth = express.Router();

Auth.use(middlewares.keyChecker);
const SALT = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const ACCESS_TOKEN = process.env.JWT_ACCESS_KEY;

// create one user
Auth.post('/', (req, res, next) => {
  const { body } = req;
  const { email, profile, password } = body;
  hash(password, SALT)
    .then((hashedPass) => {
      Users.create({ email, profile: profile || {}, password: hashedPass })
        .then((value) => {
          const refreshToken = crypto.randomBytes(16).toString('hex');
          RefreshTokens.create({ token: refreshToken, email })
            .then(() => {
              const userValue = { id: value.id, email, profile: profile || {}, refreshToken };
              const token = jwt.sign(userValue, ACCESS_TOKEN);
              res.status(201).json({ success: true, token });
            })
            .catch(next);
        })
        .catch(next);
    })
    .catch(next);
});

// update one user
Auth.put('/:id', (req, res, next) => {
  const { body } = req;
  const { id } = req.params;
  const { user } = body;
  const where = { _id: id };
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
            .then((hashedPass) => {
              Users.updateOne(where, { $set: { ...user, password: hashedPass } })
                .then((value) => {
                  res.status(200).json({ success: true, ...value.toObject() });
                })
                .catch(next);
            })
            .catch(next);
        }
      } else {
        const error = new Error(`Was unable to update a user with the id: ${id}`);
        next(error);
      }
    })
    .catch(next);
});

// get all users
Auth.get('/', (req, res, next) => {
  Users.find()
    .then((data) => {
      if (data !== null) {
        res.status(200).json({ success: true, users: data });
      } else {
        const error = new Error('Theres no users to show');
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
        const error = new Error(`Was unable to get a user with the id: ${id}`);
        next(error);
      }
    })
    .catch(next);
});

// delete one user
Auth.delete('/:id', (req, res, next) => {
  const { body } = req;
  const { id } = req.params;
  Users.deleteOne({ _id: id })
    .then((data) => {
      if (data.n !== 0) {
        res.status(200).json({ success: true, info: data });
      } else {
        const error = new Error(`Was unable to delete a user with the id: ${id}`);
        next(error);
      }
    })
    .catch(next);
});

Auth.post('/login', (req, res, next) => {
  const { body } = req;
  const { email, password } = body;
  Users.findOne({ email })
    .then((user) => {
      if (user !== null) {
        if (compareSync(password, user.password)) {
          const refreshToken = crypto.randomBytes(16).toString('hex');
          RefreshTokens.findOneAndDelete({ email: email })
            .then(() => {
              RefreshTokens.create({ token: refreshToken, email })
                .then(() => {
                  const userValue = {
                    id: user.id,
                    email,
                    profile: user.profile || {},
                    refreshToken,
                  };
                  const token = jwt.sign(userValue, ACCESS_TOKEN);
                  res.status(201).json({ success: true, token });
                })
                .catch(next);
            })
            .catch(next);
        } else {
          const error = new Error('Password incorrect');
          next(error);
        }
      } else {
        const error = new Error('Email not found');
        next(error);
      }
    })
    .catch(next);
});

Auth.post('/token', (req, res, next) => {});

Auth.use(middlewares.defaultError);

module.exports = Auth;
