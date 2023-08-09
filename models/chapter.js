const mongoose = require("mongoose");
const { noteSchema } = require("./notes");
const chapterSchema = mongoose.Schema({
  _id: {
    type: Number,
    required: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  image: {
    type: String,
    default: "",
  },
  dateCreated: {
    type: String,
  },
  userId: {
    type: String,
    required: true,
  },
  chapterNotes: [
    // {
    //   note: noteSchema,
    // },
  ],
});

const Chapter = mongoose.model("chapter", chapterSchema);
module.exports = { Chapter, chapterSchema };
