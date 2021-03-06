require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const body = require('body-parser');
const path = require('path');
const fs = require('fs');
const { initDB } = require('./helpers/mongoUtil');
const middlewares = require('./middlewares');
const api = require('./routers/api.router');

const PORT = 1217;
const app = express();
initDB();

app.use(cors());
app.use(body.urlencoded({ extended: true }));
app.use(body.json());
app.use(helmet());

if (!fs.existsSync('logs')) {
  fs.mkdirSync('logs');
}
const date = new Date();
const accessLogStream = fs.createWriteStream(
  path.join('logs', `${date.toLocaleDateString().replace(/\//g, '-')}.log`),
  { flags: 'a' },
);
app.use(morgan('tiny', { stream: accessLogStream }));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
  app.get('/dash*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '..', 'client', 'build', 'index.html'));
  });
}

app.use('/api', api);

app.use(middlewares.defaultError);
app.use(middlewares.NotFound);

app.listen(PORT, () => {
  console.log(`App running at ${PORT}`);
});
