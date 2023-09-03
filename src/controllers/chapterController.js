const path = require('path');
const Grid = require('gridfs-stream');
const Chapter = require('../models/ChapterModel');
// const Chapter = require(path.resolve(__dirname, '..', 'models', 'ChapterModel'));

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

// FUNCTIONS
const readFile = async (req, res) => { // Reads one file and renders page
  try {
    const title = req.params.title, chapter = req.params.chapter;
    const chap = await Chapter.readByTitleAndNumber(title, chapter); // Getting data from database
    return res.render('page', { chap });
  } catch (e) {
    res.status(404).render('err/404');
    console.error(e);
  }
};

const getFile = async (req, res) => { // Gets file and returns from a read stream
  try {
    const id = req.params.fileId;
    const file = await gfs.files.findOne({ id }); // Getting file from database

    if (file.contentType === 'application/pdf') { // Checking if file is pdf
      bucket.openDownloadStream(file._id).pipe(res);
    } else {
      return res.status(404).json({ err: 'Incorrect file type' });
    }
  } catch (e) { console.error(e); }
};

const readFileJSON = async (req, res) => { // Reads one file from database and returns as json
  const filename = req.params.filename;
  const file = await gfs.files.findOne({ filename }, (err, file) => { // Getting file from database

    if (err) return res.status(404).json({ err }); // Checking for errors
    else if (!file || file.length === 0) // Checking if file exists
      return res.status(404).json({ error: 'file not found' });

    return JSON.stringify(file);
  });
  return res.json(file);
};

const readAll = async (req, res) => { // Reads all files
  const files = await gfs.files.find().toArray(); // Getting files form database
  return res.json(files);
};

const upload = async (req, res) => { // Uploads a file into database
  try {
    if (!req.body) throw new Error('No data sent'); // Checking for req body

    const chap = new Chapter(req.body);
    chap.body.file = req.file.id;
    await chap.create(); // Creating instance in database

    return res.status(200).redirect('/admin');
  } catch (e) {
    console.error(e);
    return res.status(500).render('err/500');
  }
};

const destroy = async (req, res) => { // Deletes a file
  try {
    let id = req.params.id;
    const chapter = await Chapter.delete(id); // Removing chapter from database

    const file = chapter.file;
    bucket.delete(new ObjectId(file));

    return res.status(200).redirect('/admin');
  } catch (e) {
    console.log(e);
    return res.status(500).render('err/500');
  }
};

module.exports = {
  readFileJSON,
  readFile,
  getFile,
  readAll,
  upload,
  destroy,
};