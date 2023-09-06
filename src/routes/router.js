const express = require('express');
const Router = express.Router();

const home = require('../controllers/homeController');
const chapter = require('../controllers/chapterController');
const title = require('../controllers/titleController');
const mongo = require('../database/mongodb');
const { adminRequired } = require('../middlewares/sessionMiddleware');

Router.get('/', home.index);

// Admin routes
const Admin = express.Router();
Admin.get('/', adminRequired, home.admin);
Admin.get('/auth', home.adminAuthIndex);
Admin.post('/auth', home.adminAuth);
Admin.get('/logout', home.logout);


// Title routes
const Titles = express.Router();
Titles.get('/:title/:chapter', chapter.readFile);
Titles.post('/create', title.create);
Titles.post('/edit/:id', title.update);
Titles.post('/delete/:id', title.destroy);

// File routes
const Files = express.Router();
Files.get('/', chapter.readAll);
Files.get('/json/:filename', chapter.readFileJSON);
Files.get('/getfile/:fileid', chapter.getFile);
Files.post('/upload', mongo.upload.single('file'), chapter.upload);
Files.post('/delete/:id', chapter.destroy);

// Routers
Router.use('/admin', Admin);
Router.use('/titles', Titles);
Router.use('/files', Files);

// Errors
Router.get('/500', (req, res) => res.status(500).render('err/500'));
Router.get('*', (req, res) => res.status(404).render('err/404'));

module.exports = Router;