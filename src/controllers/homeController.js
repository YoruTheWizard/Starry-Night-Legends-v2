const path = require('path');
const Title = require('../models/TitleModel');
const Chapter = require('../models/ChapterModel');
// const Title = require(path.resolve(__dirname, '..', 'models', 'TitleModel'));
// const Chapter = require(path.resolve(__dirname, '..', 'models', 'ChapterModel'));

const index = async (req, res) => { // Renders home page
  const titles = await Title.readAll();
  if (!titles || titles.length === 0)
    return res.render('index', { titles: false });
  else {
    for (let title of titles) {
      const chapters = await Chapter.readByTitleName(title.name);

      if (chapters && chapters.length > 0)
        title.chapters = chapters;
      else title.chapters = false;
    }
    return res.render('index', { titles });
  }
};

const adminAuth = (req, res) => res.render('admin-auth');

const admin = async (req, res) => { // Renders admin page
  const password = req.body.password;
  if (password === process.env.ADMIN_PASSWORD) {
    const titles = await Title.readAll();
    if (!titles || titles.length === 0)
      return res.render('admin', { titles: false });
    return res.render('admin', { titles });
  }
  return res.redirect('back');
};

module.exports = {
  index,
  admin,
  adminAuth
};