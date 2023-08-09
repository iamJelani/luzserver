const { default: mongoose } = require("mongoose");

const noteSchema = mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: {
    type: String,
  },
  ownerId: {
    type: String,
    required: true,
  },
  topicIds: [{}],
  date: {
    type: String,
    required: true,
  },
});

const Note = mongoose.model("note", noteSchema);
module.exports = { Note, noteSchema };
