const Title = require('../models/TitleModel');
// const Title = require(path.resolve(__dirname, '..', 'models', 'TitleModel'));

const create = async (req, res) => { // Creates a title in database
  try {
    console.log(req.body);
    const title = new Title(req.body);
    await title.create();
    return res.redirect('back');
  } catch (e) {
    console.error(e);
    res.status(500).render('err/500');
  }
};

module.exports = {
  create
};