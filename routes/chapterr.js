const express = require("express");
const { Chapter } = require("../models/chapter");
const auth = require("../middlewere.js/auth");
const { User } = require("../models/user");
const { Note } = require("../models/notes");
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
    const user = await User.findById(req.user);
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

    await Chapter.findOneAndUpdate(
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

chapterRouter.post("/delete-chapter/:chapterId", auth, async (req, res) => {
  try {
    console.log("HI");
    const { chapterId } = req.params;
    let chapter = await Chapter.findByIdAndDelete(chapterId);
    res.json(chapter);
  } catch (error) {
    res.json(error);
    console.log(`Failed to delete chapter: ${error}`);
  }
});

chapterRouter.post("/create-note/chapter", auth, async (req, res) => {
  try {
    const { chapterId, noteTitle, noteContent, ownerId, noteId, date } =
      req.body;
    let findNote = noteId != "" ? await Note.findById(noteId) : "";
    let topicIds = findNote ? findNote.topicIds : [];
    let chapter = await Chapter.findById(chapterId[0]);
    if (!findNote) {
      let note = new Note({
        title: noteTitle,
        topicIds: chapterId,
        ownerId: ownerId,
        content: noteContent,
        date: date,
      });
      await note.save();
      if (chapter && chapter.chapterNotes) {
        chapter.chapterNotes.push({ note });
        await chapter.save();
      } else {
        console.log("Could not find chapter or chapterNote");
      }
      res.json(note);
    } else {
      const updatedNote = await Note.findOneAndUpdate(
        { _id: noteId },
        { $set: { content: noteContent, title: noteTitle } },
        { new: true }
      );

      for (const topicId of topicIds) {
        console.log(`Check topic ID: ${topicId}`);
        let chapter = await Chapter.findById({ topicId });
        if (chapter && chapter.chapterNotes) {
          let chapterNoteIndex = await chapter.chapterNotes.findIndex(
            (note) => note.note._id.toString() === noteId
          );
          console.log(`Note index in chapNote: ${chapterNoteIndex}`);

          if (chapterNoteIndex > -1) {
            chapter.chapterNotes[chapterNoteIndex].note.title = noteTitle;
            chapter.chapterNotes[chapterNoteIndex].note.content = noteContent;
            await chapter.save();
          }
        } else {
          console.log(`Could not find chapter or chapterNotes for ${topicId}`);
        }
      }

      res.json(updatedNote);
    }
  } catch (error) {
    console.log(`failed to create note in chapter: ${error}`);
  }
});

// chapterRouter.get("/get-chapters", async (req, res) => {});
module.exports = chapterRouter;
