const mongoose = require("mongoose");
const { chapterSchema } = require("./chapter");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (value) => {
        const jagon =
          /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
        return value.match(jagon);
      },
      message: "Invalid Email",
    },
  },
  password: {
    type: String,
    required: true,
  },
  chapters: [
    {
      note: chapterSchema,
    },
  ],
});
const User = mongoose.model("user", userSchema);
module.exports = { User, userSchema };
