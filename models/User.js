const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
  },
  password: { type: String, required: true },
  profile: { type: Object, required: false },
});

module.exports = mongoose.model('SINEBASE_USERS', userSchema);
