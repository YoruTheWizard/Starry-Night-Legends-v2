const mongoose = require('mongoose');

const ChapterSchema = new mongoose.Schema({
  name: { type: String, required: true, default: '' },
  number: { type: Number, default: 1, min: 0 },
  titleName: { type: String, required: true },
  file: { type: String, required: true },
  uploadDate: { type: Date, default: Date.now() }
});

const ChapterModel = mongoose.model('Chapter', ChapterSchema);

class Chapter {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.chapter = null;
  }

  async create() {
    this.chapter = await ChapterModel.create(this.body);
  }

  static async readAll() {
    const chapters = await ChapterModel.find();
    return chapters;
  }

  static async readByTitleName(titleName) {
    const chapters = await ChapterModel.find({ titleName }).sort({ number: -1 });
    return chapters;
  }

  static async readByTitleAndNumber(titleName, number) {
    const chapter = await ChapterModel.findOne({ titleName, number });
    return chapter;
  }

  static async readById(id) {
    if (typeof id !== 'string') return;
    const chapter = await ChapterModel.findById(id);
    return chapter;
  }

  async update(id) {
    if (typeof id !== 'string') return;
    this.adjust();
    this.chapter = await ChapterModel.findByIdAndUpdate(id, this.body, { new: true });
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    const chapter = await ChapterModel.findByIdAndDelete(id);
    return chapter;
  }

  static async deleteByFileId(file) {
    if (typeof id !== 'string') return;
    const chapter = await ChapterModel.findOneAndDelete({ file });
    return chapter;
  }
};

module.exports = Chapter;