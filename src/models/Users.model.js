const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    index: true,
    unique: true,
    required: true,
    match: /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/,
  },
  password: { type: String, required: true },
  profile: { type: Object, required: false },
});

module.exports = mongoose.model('waterbase_users', userSchema);
