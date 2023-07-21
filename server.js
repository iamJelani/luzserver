const express = require("express");
const mongoose = require("mongoose");
// const { MongoClient } = require('mongodb');

//Imports From Other Files
const chapterRouter = require("./routes/chapterr");
const authRouter = require("./routes/auth_route");
const noteRouter = require("./routes/note_routes");

//Init
const PORT = process.env.PORT || 3000;
const app = express();
const DB =
  "mongodb+srv://lukas:LukasPassword@lukas-cluster.ewganqf.mongodb.net/?retryWrites=true&w=majority";

//Middleware
app.use(express.json());
app.use(chapterRouter);
app.use(authRouter);
app.use(noteRouter);

//Connections
mongoose
  .connect(DB)
  .then(() => {
    console.log("Ready");
  })
  .catch((e) => {
    console.log("Failed to connect because: " + e);
  });

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Connected at port: ${PORT}`);
});
