const mongoose = require(`mongoose`);

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model("authorUpload", schema);