const { default: mongoose } = require("mongoose");

const noteSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  content: [{}],
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
