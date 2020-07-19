const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: { type: String, unique: true, required: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model('SINEBASE_MEDIA', mediaSchema);
