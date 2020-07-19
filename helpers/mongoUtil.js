const mongoose = require('mongoose');

function initDB() {
  const url = `${process.env.MONGO_URL}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
  mongoose.connect(
    url,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    },
    (err) => {
      if (err) throw err;
    },
  );
}
const { connection } = mongoose;

module.exports = { initDB, connection };
