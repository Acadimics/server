const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Logger = require('./logger');
const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // for parsing application/json

const institutions = require('./institutions.js');
const fields = require('./fields.js');
const constraints = require('./constraints.js');
const bagruts = require('./bagruts.js');
const search = require('./search.js');

app.use('/institutions', institutions);
app.use('/fields', fields);
app.use('/constraints', constraints);
app.use('/bagruts', bagruts);
app.use('/search', search);

function main(req, res) {
  console.log('recevied post method');
  res.send('Good Job!!!!!');
};

app.post('/main', main);

app.listen(port, (err) => {
  if (err) {
    console.log("Something bad happend");
    return;
  }

  console.log('Server is listening on port: ' + port);
});
