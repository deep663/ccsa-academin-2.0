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


const updateTeacher = asyncHandler(async (req, res) => {
  const teacherId = req.params.teacherId;
  const teacher = await Teacher.findById(teacherId);

  if (!teacher) {
    return res.status(404).json({ message: "Teacher not found" });
  }

  const updatedTeacher = await Teacher.findByIdAndUpdate(teacherId, {
    expertise: req.body.expertise,
    educational_qualifications: req.body.educational_qualifications
  }, { new: true });

  res.status(200).json({ message: "Teacher profile updated successfully", updatedTeacher });
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
  updateTeacher,
  deleteTeacher,
};
