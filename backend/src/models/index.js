const Mongoose = require("mongoose");
const {Schema} = Mongoose;

const bookSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['want-to-read', 'currently-reading', 'read'],
    default: 'want-to-read'
  },
  dateAdded: {
    type: Date,
    default: Date.now
  },
  dateStarted: {
    type: Date
  },
  dateRead: {
    type: Date
  }
}, {timestamps: true});

const Book = Mongoose.model("book", bookSchema);

module.exports = {Book};