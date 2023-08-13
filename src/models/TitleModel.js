const mongoose = require('mongoose');

const TitleSchema = new mongoose.Schema({
  name: { type: String, required: true },
  displayName: String,
  description: { type: String, default: 'Sem descrição' }
});

const TitleModel = mongoose.model('Title', TitleSchema);

class Title {
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.title = null;
  }

  adjust() {
    this.body.displayName = this.body.name;
    this.body.name =
      this.body.name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(' ', '-');
  }

  async create() {
    if (!this.body) throw new Error('No data sent');
    this.adjust();
    this.title = await TitleModel.create(this.body);
  }

  static async readAll() {
    const titles = await TitleModel.find();
    return titles;
  }

  static async readById(id) {
    if (typeof id !== 'string') return;
    const title = await TitleModel.findById(id);
    return title;
  }

  async update(id) {
    if (typeof id !== 'string') return;
    this.adjust();
    this.title = await TitleModel.findByIdAndUpdate(id, this.body, { new: true });
  }

  static async delete(id) {
    if (typeof id !== 'string') return;
    const title = await TitleModel.findByIdAndDelete(id);
    return title;
  }

  static async deleteByFileId(file) {
    if (typeof id !== 'string') return;
    const title = await TitleModel.findOneAndDelete({ file });
    return title;
  }
};

module.exports = Title;