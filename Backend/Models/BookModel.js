const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },

  subtitle: {
    type: String,
    trim: true,
  },

  author: {
    type: String,
    required: true,
    trim: true,
  },

  // Array of co-authors, each with a name and email
  coAuthors: [
    {
      name: {
        type: String,
        required: false,
        trim: true,
      },
      email: {
        type: String,
        required: false,
        trim: true,
      },
    },
  ],

  genre: {
    type: [String],
    required: true,
  },

  description: {
    type: String,
    trim: true,
  },

  language: {
    type: String,
    required: true,
    trim: true,
  },

  pages: {
    type: Number,
    min: 1,
  },

  amount: {
    type: Number,
    required: true,
    min: 0, // Ensuring no negative values
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  // Placeholders for cover page and eBook PDF fields (if needed)
  coverImage: {
    type: String,
    required: true,
  },

  file: {
    type: String,
    required: true,
  },
});

if (mongoose.models['Book']) {
  delete mongoose.models['Book'];
}

module.exports = mongoose.model("Book", bookSchema);
