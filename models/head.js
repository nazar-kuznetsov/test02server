const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const headSchema = new Schema({
  title: String,
  path: String,
  description: String,
  keywords: String
}, {
  versionKey: false
});

module.exports = mongoose.model('head', headSchema);
