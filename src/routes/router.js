const express = require('express');
const Router = express.Router();
const home = require('../controllers/homeController');
const chapter = require('../controllers/chapterController');
const mongo = require('../database/mongodb');
const title = require('../controllers/titleController');

// Page routes
Router.get('/', home.index);
Router.get('/admin', home.adminAuth);
Router.post('/admin', home.admin);

// Title routes
const Titles = express.Router();
Titles.get('/:title/:chapter', chapter.readFile);
Titles.post('/create', title.create);
Router.use('/titles', Titles);

// File routes
const Files = express.Router();
Files.get('/', chapter.readAll);
Files.get('/json/:filename', chapter.readFileJSON);
Files.get('/getfile/:fileid', chapter.getFile);
Files.post('/upload', mongo.upload.single('file'), chapter.upload);
Files.post('/delete/:id', chapter.destroy);
Router.use('/files', Files);

// 404
Router.get('*', (req, res) => res.status(404).render('err/404'));

module.exports = Router;