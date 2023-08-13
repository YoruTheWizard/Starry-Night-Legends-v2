require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const port = 3000;
const router = require(path.resolve(__dirname, 'src', 'routes', 'router'));

// DATABASE
const mongo = require(path.resolve(__dirname, 'src', 'database', 'mongodb'));

// MIDDLEWARES
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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