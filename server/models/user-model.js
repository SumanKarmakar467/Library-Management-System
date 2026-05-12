const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  membership: {
    type: String,
    required: true,
  },
  borrowedBooks: {
    type: [String],
    default: [],
  },
  issueBook: {
    type: String,
    required: false,
    default: null,
  },
  issuedDate: {
    type: String,
    required: false,
  },
  returnDate: {
    type: String,
    required: false,
  },
  subscriptionDate: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('User', userSchema);
