const mongoose = require('mongoose');

function initDB() {
  const url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_URI}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
  mongoose.connect(
    url,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
    },
    (err) => {
      if (err) throw err;
      console.log('ready');
    },
  );
}
const { connection } = mongoose;

module.exports = { initDB, connection };
