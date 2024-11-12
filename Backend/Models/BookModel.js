const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true  // to ensure the removal of whitespaces at the start and end of the string.
  },

  subtitle: {
    type: String,
    trim: true
  },

  author: {
    type: String,
    required: true,
    trim: true
  },

  genre: {
    type: [String],
    required: true
  },

  description: {
    type: String,
    trim: true
  },
  
  language: {
    type: String,
    required: true,
    trim: true
  },

  pages: {
    type: Number,
    min: 1
  },
  
  amount: {
      type: Number,
      required: true,
      min: 0 // Ensuring negative don't get inserted.
  },

  ratings: {
    averageRating: {
      type: Number,
      min: 0,
      max: 5 // Ensuring rating between 0 to 5.
    },
    ratingCount: {
      type: Number,
      min: 0
    }
  },

  createdAt: {
    type: Date,
    default: Date.now
  },

  // Addition of coverpage and ebook PDF left.

});

module.exports = mongoose.model('book', bookSchema);
