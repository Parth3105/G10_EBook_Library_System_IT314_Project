const { required } = require("joi");
const mongoose = require(`mongoose`);

const schema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true, // to ensure the removal of whitespaces at the start and end of the string.
  },

  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },

  userRole: {
    type: String,
    required: false,
  },

  verified: {
    type: Boolean,
    default: false,
  },
});

module.exports = mongoose.model("user", schema);
