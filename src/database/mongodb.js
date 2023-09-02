const env = process.env;
const mongoose = require('mongoose');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');

const dbConn = 'Database connected';
let connected = false;

// MongoDB connection
async function connect() {
  connected = true;
  return new Promise(async (resolve) => {
    await mongoose.connect(env.ATLASDB_CONN, { writeConcern: { wtimeout: 30000 } })
      .catch(err => {
        console.error(err);
        process.exit(5);
      });
    console.log('Database connected');
    resolve(mongoose);
  });
}

// Storage engine
const storage = new GridFsStorage({
  url: env.ATLASDB_CONN,
  file: (req, file) => {
    return new Promise((resolve, reject) => {
      crypto.randomBytes(16, (err, buf) => {
        if (err) return reject(err);
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename,
          bucketName: 'chapters'
        };
        resolve(fileInfo);
      });
    });
  }
});
const upload = multer({ storage });

// Session
const session = require('express-session');
const MongoStore = require('connect-mongo');

const sessionOptions = session({
  secret: 'ambar',
  store: new MongoStore({ mongoUrl: env.ATLASDB_CONN }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true
  }
});

const getMongoose = () => {
  if (!connected) connect();
  return mongoose;
};

module.exports = {
  dbConn,
  connect,
  upload,
  sessionOptions,
  getMongoose
};