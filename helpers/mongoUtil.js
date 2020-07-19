const mongoose = require('mongoose');

const url = `${process.env.MONGO_URL}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
mongoose.connect(url, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

const { connection } = mongoose;

module.exports = connection;
