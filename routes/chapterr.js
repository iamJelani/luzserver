const express = require("express");
const { Chapter } = require("../models/chapter");
const auth = require("../middlewere.js/auth");
const { User } = require("../models/user");
const chapterRouter = express.Router();

chapterRouter.post("/add-chapter", async (req, res) => {
  try {
    const { userId, subject, image, chapterNote } = req.body;
    let chapter = new Chapter({
      subject,
      image,
      userId,
      chapterNote,
    });
    chapter = await chapter.save();
    res.json(chapter);
  } catch (e) {
    console.log(`Could not add chapter ${e}`);
  }
});

chapterRouter.get("/all-chapters/me", auth, async (req, res) => {
  try {
    const user = User.findById(req.user);
    let chapters = await Chapter.find({ userId: req.user });
    // console.log(chapters);
    res.json(chapters);
    // res.json({ ...chapters._doc });
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: e.message });
  }
});

chapterRouter.get("/find-chapter/notebooks", auth, async (req, res) => {
  try {
    const { chapterId } = req.body;
    const { noteId } = req.body;
    const { newTitle } = req.body;
    const { newDate } = req.body;
    console.log("ChapterId:" + chapterId);
    console.log("noteId:" + noteId);

    Chapter.findOneAndUpdate(
      { "note.id": noteId },
      {
        $set: {
          "note.$.title": newTitle,
          "note.$.date": newDate,
        },
      }
    )
      .then((doc) => {
        console.log(doc);
      })
      .catch((err) => {
        console.log("Something wrong when updating note!", err);
      });
    // res.json(note);
  } catch (error) {
    console.log("Print chapter ID error: " + error);
  }
});

// chapterRouter.get("/get-chapters", async (req, res) => {});
module.exports = chapterRouter;
