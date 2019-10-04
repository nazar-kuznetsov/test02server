const mongoose = require('mongoose');


const Schema = mongoose.Schema;

const usersSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true,
    min: 8,
    max: 32
  },
  name: {
    type: String
  },
  reset_password_token: String,
  reset_password_expires: Date
}, {
  versionKey: false
});

module.exports = mongoose.model('users', usersSchema);
