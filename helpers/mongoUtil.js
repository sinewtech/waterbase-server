const { MongoClient } = require('mongodb');

const url = `${process.env.MONGO_URL}:${process.env.MONGO_PORT}/${process.env.MONGO_DB}`;
let database;

module.exports = function () {
  return new Promise((resolve, reject) => {
    if (database) resolve(database);
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, connection) => {
      if (err) reject(err);
      database = connection.db();
      resolve(database);
    });
  });
};
