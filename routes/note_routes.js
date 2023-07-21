// const update = { $push: { chapterNotes: { note: { $each: [note] } } } };
// const update = { $push: { chapterNotes: { note: [note] } } };
// const update = { $push: { chapterNotes: [note] } };
const express = require("express");
const auth = require("../middlewere.js/auth");
const { Chapter } = require("../models/chapter");
const { Note } = require("../models/notes");
const noteRouter = express.Router();

noteRouter.post("/add_note/update_note", auth, async (req, res) => {
  const { id, ownerId, title, content, date } = req.body;
  let newNote = new Note({ title, content, ownerId, date });

  try {
    let existingNote = id != "" ? await Note.findById(id) : "";
    let topicIds = existingNote ? existingNote.topicIds : [];
    console.log("topicIds: " + topicIds);

    // console.log("existingNote: " + existingNote);
    if (existingNote) {
      const updatedNote = await Note.findOneAndUpdate(
        { _id: id },
        { title, content },
        { new: true }
      );

      for (const topicId of topicIds) {
        let chapter = await Chapter.findById(topicId);
        let chapterNoteIndex = chapter.chapterNotes.findIndex(
          (note) => note.note._id.toString() === id
        );

        if (chapterNoteIndex > -1) {
          chapter.chapterNotes[chapterNoteIndex].note.title = title;
          chapter.chapterNotes[chapterNoteIndex].note.content = content;
          await chapter.save();
        }
      }
      res.json(updatedNote);
    } else {
      await newNote.save();
      res.json(newNote);
    }
  } catch (error) {
    console.error("Could not add or update note: ", error);
    res.status(500).send({ error: "Could not add or update note" });
  }
});

noteRouter.get("/get-all-notes/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    let allNotes = await Note.find({ ownerId: id });
    res.json(allNotes);
  } catch (error) {
    res.json(error);
    console.log(`Could not get notes: ${error}`);
  }
});

// noteRouter.post("/update-note/:id", auth, async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { title, content, ownerId, date } = req.body;
//     const filter = { _id: id };
//     const options = { new: true };
//     const update = {
//       title: title,
//       content: content,
//       ownerId: ownerId,
//     };
//     let doc = await Note.FindOneAndUpdate(filter, update, options);
//     doc = await doc.save();
//     console.log(`Updated Note: ${doc}`);
//     res.json(doc);
//   } catch (error) {
//     console.log("Could not update Note: " + e);
//   }
// });

noteRouter.post("/add-to-chapter/:noteId", auth, async (req, res) => {
  try {
    const { noteId } = req.params;
    const { chapId } = req.body;
    const { topicId } = req.body;
    let chapter = await Chapter.findOne({ _id: chapId });
    let note = await Note.findById(noteId);
    let noteExist = false;
    console.log("TopicId: " + topicId);
    console.log("ChapterId: " + chapId);

    if (chapter) {
      if (note) {
        await note.topicIds.push(chapter._id);
        // await  chapter.chapterNotes.push({ note });
        // res.json(chapter);
      } else {
        console.log("Note does not exist");
      }

      // for (let o = 0; o < chapter.chapterNotes.length; o++) {
      //   if (chapter.chapterNotes[o].note._id.equals(note._id)) {
      //     noteExist = true;
      //   }
      // }

      chapter.chapterNotes.forEach((chapterNote) => {
        if (chapterNote.note._id.equals(note._id)) {
          noteExist = true;
        }
      });

      if (noteExist) {
        res.json("Note already exists in chapter");
      } else {
        chapter.chapterNotes.push({ note });
        res.json(chapter);
        console.log("Added successfully");
      }
    } else {
      console.log("Chapter does not exist");
    }
    await chapter.save();
    await note.save();
  } catch (error) {
    console.log("Could not add chapter:" + error);
  }
});

module.exports = noteRouter;