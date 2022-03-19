const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

const port = 8000;

app.use(cors());

app.use(bodyParser.json());

app.use('/', require('./controls'));

app.listen(port, () => console.log('started server successfuly'));
