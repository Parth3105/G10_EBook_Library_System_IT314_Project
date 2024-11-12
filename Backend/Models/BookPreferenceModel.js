const mongoose=require("mongoose");

const schema = mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true // to ensure the removal of whitespaces at the start and end of the string.
        },

        bookTitle: {
            type: String,
            required: true,
            trim: true  // to ensure the removal of whitespaces at the start and end of the string.
        },

        author: {
            type: String,
            required: true,
            trim: true
        },
    }
);

module.exports = mongoose.model("wishlist",schema);