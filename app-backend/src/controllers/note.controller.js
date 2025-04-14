//notes controllers
const fs = require("fs");
const path = require("path");
const Note = require("../models/note.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

const getNotes = asyncHandler(async (req, res) => {
  const notes = await Note.find();
  return res
    .status(200)
    .json(new ApiResponse(200, "Notes fetched successfully", notes));
});

//get notes by teacher id
const getNotesByTeacherId = asyncHandler(async (req, res) => {
  const notes = await Note.find({ teacher: req.params.teacherId }).populate(
    "subject",
    ("_id", "name")
  );
  return res
    .status(200)
    .json(new ApiResponse(200, "Notes fetched successfully", notes));
});

//get notes by subject id
const getNotesBySubjectId = asyncHandler(async (req, res) => {
  const notes = await Note.find({ subject: req.params.subjectId });
  return res
    .status(200)
    .json(new ApiResponse(200, "Notes fetched successfully", notes));
});

//create note
const createNote = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "All fields are required");
  }

  const fileLinks = req.files.map((file) => {
    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}` 
  });


  const noteData = {
    title: req.body.title,
    content: req.body.content,
    files: fileLinks || [],
    teacher: req.body.teacher,
    subject: req.body.subject,
    semester: req.body.semester,
    course: req.body.course,
  };

  const note = await Note.create(noteData);

  return res
    .status(200)
    .json(new ApiResponse(200, "Note created successfully", note));
});

//update note
const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const note = await Note.findByIdAndUpdate(id, updates, { new: true });

  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Note updated successfully", note));
});

//delete note
const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the note before deleting
  const note = await Note.findById(id);
  if (!note) {
    throw new ApiError(404, "Note not found");
  }

  // Delete associated files from the server
  if (note.files && note.files.length > 0) {
    note.files.forEach((fileUrl) => {
      // Extract filename after "uploads/"
      const filename = fileUrl.split("uploads/")[1];

      if (filename) {
        const filePath = path.join(__dirname, "../../public/uploads", filename);
        // Check if file exists, then delete it
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    });
  }

  // Delete the note from the database
  await Note.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Note and associated files deleted successfully"));
});

module.exports = {
  getNotes,
  getNotesByTeacherId,
  getNotesBySubjectId,
  createNote,
  updateNote,
  deleteNote,
};
