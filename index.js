require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const body = require('body-parser');
const path = require('path');
const fs = require('fs');
const Auth = require('./routers/auth');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(cors());
app.use(body.urlencoded({ extended: true }));
app.use(body.json());
app.use(helmet());

if (!fs.existsSync(path.join(__dirname, 'logs'))) {
  fs.mkdirSync(path.join(__dirname, 'logs'));
}
const date = new Date();
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, 'logs', `${date.toLocaleDateString().replace(/\//g, '-')}.log`),
  { flags: 'a' },
);
app.use(morgan('tiny', { stream: accessLogStream }));

app.use('/auth', Auth);
app.listen(PORT, () => {
  console.log(`App running at ${PORT}`);
});
