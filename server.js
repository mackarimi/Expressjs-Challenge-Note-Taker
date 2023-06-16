const PORT = process.env.PORT || 3001;
const fs = require("fs");
const path = require("path");

const express = require("express");
const app = express();

const allNotes = require("./db/db.json");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// API Routes
app.get("/api/notes", (req, res) => {
  res.json(allNotes.slice(1));
});

// HTML Routes
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

function createNewNote(body, notesArray) {
  const newNote = body;
  if (!Array.isArray(notesArray)) notesArray = [];
  if (notesArray.length === 0) notesArray.push(0);
  body.id = notesArray[0];
  notesArray[0]++;

  notesArray.push(newNote);
  fs.writeFileSync(
    path.join(__dirname, "./db/db.json"),
    JSON.stringify(notesArray, null, 2)
  );
  return newNote;
}

// Create New Notes - takes in JSON input
app.post("/api/notes", (req, res) => {
  const newNote = createNewNote(req.body, allNotes);
  res.json(newNote);
});

function deleteNoteById(id, notesArray) {
  for (let i = 0; i < notesArray.length; i++) {
    let note = notesArray[i];

    if (note.id == id) {
      notesArray.splice(i, 1);
      fs.writeFileSync(
        path.join(__dirname, "./db/db.json"),
        JSON.stringify(notesArray, null, 2)
      );
      break;
    }
  }
}

// Delete Notes
app.delete("/api/notes/:id", (req, res) => {
  deleteNoteById(req.params.id, allNotes);
  res.json(true);
});

app.listen(PORT, () => {
  console.log(`API server running now on port ${PORT}!`);
});