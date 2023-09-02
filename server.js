require('dotenv').config();
const path = require('path');

// EXPRESS
const express = require('express');
const app = express();
const port = 3000;
const router = require(path.resolve(__dirname, 'src', 'routes', 'router'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// DATABASE
const mongo = require(path.resolve(__dirname, 'src', 'database', 'mongodb'));

// SESSION
// const { sessionUser } = require(path.resolve(__dirname, 'src', 'middlewares', 'sessionMiddleware'));
const { sessionUser } = require('./src/middlewares/sessionMiddleware');
app.use(mongo.sessionOptions);
app.use(sessionUser);

// STATIC
app.set('views', 'src/views');
app.set('view engine', 'ejs');
app.use(express.static('public'));

// ROUTER
app.use(router);

// SERVER
mongo.connect().then(() => app.listen(port, () =>
  console.log(`Server listening on port ${port}`)
));