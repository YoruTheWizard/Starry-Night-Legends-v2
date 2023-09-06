const path = require('path');
const Grid = require('gridfs-stream');
const Title = require('../models/TitleModel');
const Chapter = require('../models/ChapterModel');
// const Title = require(path.resolve(__dirname, '..', 'models', 'TitleModel'));

// GRIDFS
const mongo = require('../database/mongodb');
const { ObjectId } = require('mongodb');

// const mongo = require(path.resolve(__dirname, '..', 'database', 'mongodb'));
let gfs, bucket;
let mongoose = mongo.getMongoose();
mongoose.connection.once('open', () => {
  let db = mongoose.connections[0].db;
  // Init GridFS Bucket
  bucket = new mongoose.mongo.GridFSBucket(db, { bucketName: 'chapters' });

  // Init GridFS Stream
  gfs = Grid(db, mongoose.mongo);
  gfs.collection('chapters');
});

const create = async (req, res) => { // Creates a title in database
  try {
    const title = new Title(req.body);
    await title.create();
    return res.redirect('back');
  } catch (e) {
    console.error(e);
    return res.redirect('/500');
  }
};

const update = async (req, res) => { // Updates a title in database
  try {
    const id = req.params.id;
    const title = new Title(req.body);
    await title.update(id);

    return res.status(200).redirect('back');
  } catch (e) {
    console.error(e);
    return res.redirect('/500');
  }
};

const destroy = async (req, res) => { // Deletes a title from database
  try {
    const id = req.params.id;
    let title = await Title.delete(id);
    console.log(title);

    let chapters = await Chapter.readByTitleName(title.name);
    console.log(chapters);
    if (chapters.length > 0) for (let chapter of chapters) {
      await Chapter.delete(chapter._id);
      bucket.delete(new ObjectId(chapter.file));
    }

    return res.status(200).redirect('back');
  } catch (e) {
    console.error(e);
    return res.redirect('/500');
  }
};

module.exports = {
  create,
  update,
  destroy
};