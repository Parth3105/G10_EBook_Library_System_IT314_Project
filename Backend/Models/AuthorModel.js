const mongoose = require(`mongoose`);

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true, // to ensure the removal of whitespaces at the start and end of the string.
  },

  bookName: {
    type: String,
    required: true,
    trim: true,
  },
  bookPDF: {
    type: String,
    required: true,
  },

  bookLink: {
    type: String,
    required: false,
  },

  socialMediaLink: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("author", schema);