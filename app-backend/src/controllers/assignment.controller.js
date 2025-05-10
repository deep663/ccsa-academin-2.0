//assignment controller
const fs = require("fs");
const path = require("path");
const Assignment = require("../models/assignment.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

const getAssignmentsByTeacherId = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({
    teacher: req.params.teacherId,
  }).populate("subject", ("_id", "name"));
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Assignments fetched successfully", assignments)
    );
});

const getAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.find({
    course: req.params.course,
    semester: req.params.semester,
  })
    .populate("subject", ("_id", "name"))
    .sort({ createdAt: -1 });
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Assignments fetched successfully", assignments)
    );
});

const createAssignment = asyncHandler(async (req, res) => {
  if (!req.body) {
    throw new ApiError(400, "All fields are required");
  }

  const fileLinks = req.files.map((file) => {
    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  });

  const assignmentData = {
    title: req.body.title,
    description: req.body.description,
    files: fileLinks || [],
    due_date: req.body.due_date,
    teacher: req.body.teacher,
    subject: req.body.subject,
    semester: req.body.semester,
    course: req.body.course,
  };

  const assignment = await Assignment.create(assignmentData);

  return res
    .status(200)
    .json(new ApiResponse(200, "Assignment created successfully", assignment));
});

const updateAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const assignment = await Assignment.findByIdAndUpdate(id, updates, {
    new: true,
  });

  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Assignment updated successfully", assignment));
});

const deleteAssignment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Find the assignment before deleting
  const assignment = await Assignment.findById(id);
  if (!assignment) {
    throw new ApiError(404, "Assignment not found");
  }

  // Delete associated files from the server
  if (assignment.files && assignment.files.length > 0) {
    assignment.files.forEach((fileUrl) => {
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

  // Delete the assignment from the database
  await Assignment.findByIdAndDelete(id);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Assignment and associated files deleted successfully"
      )
    );
});

const getTotalAssignments = asyncHandler(async (req, res) => {
  const assignments = await Assignment.countDocuments({
    teacher: req.params.teacherId,
  });
  console.log("Total assignments count invoked", assignments);
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Assignments fetched successfully", assignments)
    );
});

const getAssignmentReminders = asyncHandler(async (req, res) => {
  const { course, semester } = req.params; // Get course and semester from query params
  const twoDaysFromNow = new Date(Date.now() + 2 * 24 * 60 * 60 * 1000);
  const twoDaysFromNowUTC = new Date(
    twoDaysFromNow.getTime() + twoDaysFromNow.getTimezoneOffset() * 60 * 1000
  );

  const assignments = await Assignment.find({
    due_date: { $lte: twoDaysFromNowUTC },
    course, // Filter by course
    semester, // Filter by semester
  })
    .populate("subject", ("_id", "name"))
    .sort({ deadline: 1 });

  const reminders = assignments.map((assignment) => {
    return {
      assignment: assignment._id,
      deadline: assignment.due_date,
      subject: assignment.subject.name,

    };
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Assignment reminders fetched successfully",
        reminders
      )
    );
});

module.exports = {
  getAssignments,
  getAssignmentsByTeacherId,
  createAssignment,
  updateAssignment,
  deleteAssignment,
  getTotalAssignments,
  getAssignmentReminders,
};
