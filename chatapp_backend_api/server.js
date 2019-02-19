const express = require ('express');
const mongoose = require ('mongoose');

const app = express ();

const dbconfig = require ('./config/secret');

mongoose.Promise = global.Promise;
// mongoose.connect ('mongodb://localhost/socialchatapp', { // this is also right
mongoose.connect (dbconfig.url, {
  useNewUrlParser: true,
});

app.listen (3000, () => {
  console.log ('Running on port 3000');
});
