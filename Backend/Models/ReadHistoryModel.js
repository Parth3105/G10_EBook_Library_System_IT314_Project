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

        coverImage: {
            type: String,
            required: true,
        },

        lastRead: {
            type: Date,
            default: Date.now
        }
    }
);

module.exports = mongoose.model("history",schema);