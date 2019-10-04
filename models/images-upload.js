const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const mediaSchema = new Schema({
  path: String,
  alt: {
    type: String,
    default: ''
  },
  type: String,
  size: Number
}, {
  timestamps: true
});

module.exports = mongoose.model('upload-files', mediaSchema);
