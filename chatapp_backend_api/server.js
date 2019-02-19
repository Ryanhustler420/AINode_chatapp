const express = require ('express');
const mongoose = require ('mongoose');

const app = express ();

mongoose.Promise = global.Promise;
// mongoose.connect ('mongodb://localhost/socialchatapp', { // this is also right
mongoose.connect ('mongodb://localhost:27017/socialchatapp', {
  useNewUrlParser: true,
});

app.listen (3000, () => {
  console.log ('Running on port 3000');
});
