const mongoose = require('mongoose');

const mediaSchema = new mongoose.Schema({
  url: { type: String, index: true, required: true },
  name: { type: String, required: true },
});

module.exports = mongoose.model('waterbase_medias', mediaSchema);
