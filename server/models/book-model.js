const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
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
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  publisher: {
    type: String,
    required: true,
  },
  subscription: {
    type: String,
    required: false,
  },
}, { timestamps: true });

module.exports = mongoose.model('Book', bookSchema);
