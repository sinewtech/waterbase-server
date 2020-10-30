const mongoose = require('mongoose');

const FileSchema = new mongoose.Schema({
  path: {
    type: String,
    index: true,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model('waterbase_files', FileSchema);
