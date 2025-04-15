const Teacher = require("../models/teacher.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

const getTeachers = asyncHandler(async (req, res) => {
  const teachers = await Teacher.find().populate("user", ("-password", "-refreshToken"));
  return res
    .status(200)
    .json(new ApiResponse(200, "Teachers fetched successfully", teachers));
});

const getTeacher = asyncHandler(async (req, res) => {
  const teacher = await Teacher.find({user: req.user._id}).populate("user", ("-password", "-refreshToken"));
  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Teacher fetched successfully", teacher));
});

const createTeacher = asyncHandler(async (req, res) => {
  const teacher_code = req.body;

  if (!teacher_code) {
    throw new ApiError(400, "All fields are required");
  }

  const existedTeacher = await Teacher.findOne({ email });
  if (existedTeacher) {
    throw new ApiError(409, "Email already exists");
  }

  const teacher = await Teacher.create({
    user: req.user._id,
    teacher_code
  });

  if (!teacher) {
    throw new ApiError(500, "Failed to create teacher");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Teacher created successfully", teacher));
});

const updateTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const teacher_code = req.body;

  const teacher = await Teacher.findByIdAndUpdate(
    { _id: id },
    {
      $set: teacher_code,  
    }, 
    {
    new: true,
  }
);

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Teacher updated successfully", teacher));
});

const deleteTeacher = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const teacher = await Teacher.findByIdAndDelete(id);

  if (!teacher) {
    throw new ApiError(404, "Teacher not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Teacher deleted successfully"));
});

module.exports = {
  getTeachers,
  getTeacher,
  createTeacher,
  updateTeacher,
  deleteTeacher,
};
