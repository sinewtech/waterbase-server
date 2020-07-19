const express = require('express');
// const mongoUtil = require('../helpers/mongoUtil');

const Auth = express.Router();
// create one user
Auth.post('/', (req, res) => {});

// update one user
Auth.put('/update', (req, res) => {});

// get all users
Auth.get('/', (req, res) => {});

// get one user
Auth.get('/:id', (req, res) => {});

// delete one user
Auth.delete('/delete', (req, res) => {});

module.exports = Auth;
