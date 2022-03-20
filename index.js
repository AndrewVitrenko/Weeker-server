require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const connect = require('./db');

connect();

const port = process.env.PORT;
const host = process.env.HOST;

app.use(cors());

app.use(bodyParser.json());

app.use('/', require('./controls'));

app.listen(port, host, () =>
  console.log('started server successfuly on port: ', port)
);
