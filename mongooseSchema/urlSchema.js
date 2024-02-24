const mongoose = require('mongoose');

const urlSchema = new mongoose.Schema({
  hash: { type: String, required: true },
  longUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  source: { type: String, required: true }
});

const Url = mongoose.model('Url', urlSchema);

  module.exports = Url;
