const Mark = require("../models/mark.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

// Get all marks
const getMarks = asyncHandler(async (req, res) => {
  const marks = await Mark.find().populate("student subject");
  return res
    .status(200)
    .json(new ApiResponse(200, "Marks fetched successfully", marks));
});

// Get mark by student ID
const getMarkById = asyncHandler(async (req, res) => {
  const mark = await Mark.find({ student: req.params.studentId })
    .populate({
      path: "student",
      select: "_id user roll_no",
      populate: { path: "user", model: "User", select: "name" },
    })
    .populate("subject", "_id name");

  if (!mark) {
    throw new ApiError(404, "Mark entry not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Mark fetched successfully", mark));
});

//get marks by subject id
const getMarksBySubjectId = asyncHandler(async (req, res) => {
  const { course, subject, semester, exam_type } = req.params;

  if (!subject || !course || !semester || !exam_type) {
    throw new ApiError(400, "All fields are required");
  }

  const marks = await Mark.find({
    subject,
    course,
    semester,
    exam_type,
  }).populate("student subject");

  if (!marks) {
    throw new ApiError(500, "Failed to fetch marks");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Marks fetched successfully", marks));
});

// Create a new mark entry
const createMark = asyncHandler(async (req, res) => {
  const {
    title,
    student,
    subject,
    semester,
    course,
    marks,
    total_marks,
    exam_type,
  } = req.body;

  if (
    (!title && !student) ||
    !subject ||
    !semester ||
    !course ||
    !marks ||
    !total_marks ||
    !exam_type
  ) {
    throw new ApiError(400, "All fields are required");
  }

  const mark = await Mark.create(req.body);

  return res
    .status(201)
    .json(new ApiResponse(201, "Mark created successfully", mark));
});

// Add multiple marks for a specific subject and semester
const addMultipleMarks = asyncHandler(async (req, res) => {
  const { title, subject, semester, course, marks, total_marks, exam_type } =
    req.body;

  // Validate required fields
  if (
    (!title && !subject) ||
    !semester ||
    !course ||
    !marks ||
    !Array.isArray(marks) ||
    !total_marks ||
    !exam_type
  ) {
    throw new ApiError(
      400,
      "Invalid input: subject, semester, course, total_marks, exam_type, and marks array are required"
    );
  }

  // Prepare data for bulk insertion
  const markEntries = marks.map((mark) => ({
    title,
    student: mark.student,
    subject,
    semester,
    course,
    marks: mark.marks,
    total_marks,
    exam_type,
  }));

  // Insert multiple records
  const newMarks = await Mark.insertMany(markEntries);

  return res
    .status(201)
    .json(new ApiResponse(201, "Marks added successfully", newMarks));
});

// Update a mark entry
const updateMark = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const mark = await Mark.findByIdAndUpdate(id, updates, { new: true });

  if (!mark) {
    throw new ApiError(404, "Mark entry not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Mark updated successfully", mark));
});

// Delete a mark entry
const deleteMark = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const mark = await Mark.findById(id);
  if (!mark) {
    throw new ApiError(404, "Mark entry not found");
  }

  await Mark.findByIdAndDelete(id);

  return res
    .status(200)
    .json(new ApiResponse(200, "Mark entry deleted successfully"));
});

const getRecentMarksUpdates = asyncHandler(async (req, res) => {
  const { course, semester } = req.params; // Get course and semester from query params
  const sevenDaysAgoUTC = new Date(Date.UTC(Date.now() / 1000 - 7 * 24 * 60 * 60));

  const marks = await Mark.find({
    createdAt: { $gte: sevenDaysAgoUTC },
    course, // Filter by course
    semester, // Filter by semester
  })
    .populate("student subject")
    .sort({ createdAt: -1 });

  const recentUpdates = marks.map((mark) => {
    return {
      mark: mark._id,
      subject: mark.subject.name,
      exam: mark.exam_type,
    };
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Recent marks updates fetched successfully",
        recentUpdates
      )
    );
});

module.exports = {
  getMarks,
  getMarkById,
  getMarksBySubjectId,
  createMark,
  addMultipleMarks,
  updateMark,
  deleteMark,
  getRecentMarksUpdates
};
