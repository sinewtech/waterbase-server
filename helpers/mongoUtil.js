const mongoose = require('mongoose');

function initDB() {
  const url = `${process.env.MONGO_URI}/${process.env.MONGO_DB}`;
  mongoose.connect(
    url,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: true,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
    },
    (err) => {
      if (err) throw err;
    },
  );
}
const { connection } = mongoose;

module.exports = { initDB, connection };
