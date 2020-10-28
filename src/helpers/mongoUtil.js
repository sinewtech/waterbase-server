const mongoose = require('mongoose');

function initDB() {
  const url = `${process.env.MONGO_URI}/${process.env.MONGO_DB}`;
  mongoose.connect(
    url,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      user: process.env.MONGO_USER,
      pass: process.env.MONGO_PASS,
    },
    (err) => {
      if (err) throw err;
      console.log('ready');
    },
  );
}
const { connection } = mongoose;

module.exports = { initDB, connection };
