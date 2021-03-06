const express = require ('express');
const mongoose = require ('mongoose');
const cookieParser = require ('cookie-parser');
const logger = require ('morgan');
const cors = require ('cors');
const _ = require ('lodash');

const app = express ();

app.use (cors ());

const server = require ('http').createServer (app);
const io = require ('socket.io').listen (server);

const {User} = require ('./Helpers/UserOnline');

require ('./socket/streams') (io, User, _);
require ('./socket/typing') (io);

const dbconfig = require ('./config/secret');
const auth = require ('./routes/authRoutes');
const posts = require ('./routes/postRoutes');
const users = require ('./routes/userRoutes');
const follow = require ('./routes/followRoute');
const message = require ('./routes/messageRoute');
const image = require ('./routes/imageRoutes');

/**
 * This Middleware is doing exactly the same thing which cors() middleware
 * is doing. so there is no need to use this code 
 */

// app.use ((req, res, next) => {
//   res.header ('Access-Control-Allow-Origin', '*');
//   res.header ('Access-Control-Allow-Credentials', 'true');
//   res.header (
//     'Access-Control-Allow-Methods',
//     'GET',
//     'POST',
//     'DELETE',
//     'PUT',
//     'OPTIONS'
//   );
//   res.header (
//     'Access-Control-Allow-Headers',
//     'Origin, X-Requested-With, Content-TypeError, Accept, Authorization'
//   );
//   next ();
// });

// app.use (express.json ());
app.use (express.json ({limit: '50mb'}));
app.use (express.urlencoded ({extended: true, limit: '50mb'}));
app.use (cookieParser ());
app.use (logger ('dev'));

mongoose.Promise = global.Promise;
// mongoose.connect ('mongodb://localhost/socialchatapp', { // this is also right
mongoose.connect (dbconfig.url, {
  useNewUrlParser: true,
});

app.use ('/api/chatapp/v1/', auth);
app.use ('/api/chatapp/v1/', posts);
app.use ('/api/chatapp/v1/', users);
app.use ('/api/chatapp/v1/', follow);
app.use ('/api/chatapp/v1/', message);
app.use ('/api/chatapp/v1/', image);

server.listen (3000, () => {
  console.log ('Running on port 3000');
});
