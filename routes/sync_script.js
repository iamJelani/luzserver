const express = require("express");
const axios = require("axios");
const { Chapter } = require("../models/chapter");
const { Note } = require("../models/notes");
const { log } = require("console");
const syncRouter = express.Router();

syncRouter.post("/sync/chapters", async (req, res) => {
  try {
    const transformedChapters = req.body;
    for (let chapter of transformedChapters) {
      console.log(chapter._id);

      const existingChapter = await Chapter.findOne({ _id: chapter._id });
      if (existingChapter) {
        await Chapter.findOneAndUpdate(
          { _id: chapter._id },
          {
            $set: {
              _id: chapter._id,
              subject: chapter.subject,
              userId: chapter.userId,
              image: chapter.image,
              chapterNotes: chapter.chapterNotes,
            },
          },
          {
            new: true,
          }
        );
      } else {
        await Chapter.create(chapter);
      }
    }
    await Chapter.deleteMany({
      _id: { $nin: transformedChapters.map((chapter) => chapter._id) },
    });
    res.status(200).json({ message: "Sync completed" });
  } catch (error) {
    console.log("error");
    res.json({ error: "Internal Server Error" });
  }
});

syncRouter.get("/chapters/get-all/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const chapters = await Chapter.find({ userId: userId });
    console.log(chapters);
    res.json(chapters);
  } catch (error) {
    console.log(error);
  }
});

syncRouter.post("/sync/notes", async (req, res) => {
  try {
    const noteAsMapList = req.body;
    for (let note of noteAsMapList) {
      const noteExist = await Note.findOne({ _id: note._id });
      if (noteExist) {
        await Note.findOneAndUpdate(
          { _id: note._id },
          {
            $set: {
              _id: note._id,
              title: note.title,
              content: note.content,
              ownerId: note.ownerId,
              date: note.date,
            },
          },
          {
            new: true,
          }
        );
      } else {
        await Note.create(note);
      }
    }
    await Note.deleteMany({
      _id: { $nin: noteAsMapList.map((note) => note._id) },
    });
    res.json({ message: "Sync Completed" });
  } catch (error) {
    res.json({ Error: "Sync failed" });
    console.log(error);
  }
});

syncRouter.get("/notes/get-all/:ownerId", async (req, res) => {
  try {
    const { ownerId } = req.params;
    let allNotes = await Note.find({ ownerId: ownerId });
    console.log(allNotes);
    res.json(allNotes);
  } catch (error) {
    console.log(error);
  }
});
module.exports = syncRouter;
