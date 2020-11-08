const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
  },
  token: {
    type: String,
    index: true,
    unique: true,
    required: true,
  },
});

module.exports = mongoose.model('waterbase_refresh_tokens', refreshTokenSchema);
