const { mongoose } = require("mongoose");
const SubmittedAssignment = require("../models/submitted_assignment.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

// @desc    Submit an assignment
// @route   POST /api/assignments/submit
// @access  Student
const submitAssignment = asyncHandler(async (req, res) => {
  const { assignment, student } = req.body;

  if (!assignment || !student || !req.files) {
    throw new ApiError(
      400,
      "Missing required fields: assignment, student, or file"
    );
  }

  const alreadySubmitted = await SubmittedAssignment.findOne({
    assignment,
    student,
  });

  if (alreadySubmitted) {
    throw new ApiError(409, "Assignment already submitted");
  }

  const fileLinks = req.files.map((file) => {
    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  });

  const submission = await SubmittedAssignment.create({
    assignment,
    student,
    files: fileLinks,
  });

  return res
    .status(201)
    .json(
      new ApiResponse(201, "Assignment submitted successfully", submission)
    );
});

const getSubmissionsbyAssignment = asyncHandler(async (req, res) => {
  const { assignId } = req.params;

  const submissions = await SubmittedAssignment.find({ assignment: assignId })
    .populate({
      path: "assignment",
    })
    .populate({
      path: "student",
      populate: {
        path: "user",
        model: "User",
        select: "name email roll_no",
      },
    })
    .sort({ createdAt: -1 });

  if (!submissions) {
    throw new ApiError(404, "Submissions not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Fetched student submissions", submissions));
});

const getStudentSubmissions = asyncHandler(async (req, res) => {
  const { studentId } = req.params;
  const submissions = await SubmittedAssignment.find({ student: studentId })
    .populate({
      path: "assignment",
      select: "title description dueDate file",
    })
    .sort({ createdAt: -1 });

  if (!submissions) {
    throw new ApiError(404, "Submissions not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Fetched student submissions", submissions));
});

const getRecentSubmissions = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  const recentSubmissions = await SubmittedAssignment.aggregate([
    {
      $lookup: {
        from: "assignments",
        localField: "assignment",
        foreignField: "_id",
        as: "assignmentDetails",
      },
    },
    { $unwind: "$assignmentDetails" },
    {
      $match: {
        "assignmentDetails.teacher": new mongoose.Types.ObjectId(teacherId),
      },
    },
    { $sort: { createdAt: -1 } },
    { $limit: 10 },
    { $count: "count" },
  ]);

  const count = recentSubmissions[0]?.count || 0;

  return res
    .status(200)
    .json(
      new ApiResponse(200, "Recent submissions fetched successfully", count)
    );
});

const getTodaysSubmissionsCount = asyncHandler(async (req, res) => {
  const { teacherId } = req.params;

  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const startOfDayUTC = new Date(
    startOfDay.getTime() + startOfDay.getTimezoneOffset() * 60 * 1000
  );

  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);
  const endOfDayUTC = new Date(
    endOfDay.getTime() + endOfDay.getTimezoneOffset() * 60 * 1000
  );

  const todaysSubmissions = await SubmittedAssignment.aggregate([
    {
      $lookup: {
        from: "assignments",
        localField: "assignment",
        foreignField: "_id",
        as: "assignmentDetails",
      },
    },
    { $unwind: "$assignmentDetails" },
    {
      $match: {
        "assignmentDetails.teacher": new mongoose.Types.ObjectId(teacherId),
        createdAt: { $gte: startOfDayUTC, $lte: endOfDayUTC },
      },
    },
    { $count: "count" },
  ]);

  const count = todaysSubmissions[0]?.count || 0;

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Today's submissions count fetched successfully",
        count
      )
    );
});

module.exports = {
  submitAssignment,
  getStudentSubmissions,
  getSubmissionsbyAssignment,
  getTodaysSubmissionsCount,
  getRecentSubmissions,
};
