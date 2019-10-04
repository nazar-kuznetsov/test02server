const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const aboutSchema = new Schema({
  name: String,
  locale: String,
  country: String,
  description: String
});

module.exports = mongoose.model('friends', aboutSchema);
