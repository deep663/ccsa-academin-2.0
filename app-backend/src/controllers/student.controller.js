const Student = require("../models/student.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

const getStudents = asyncHandler(async (req, res) => {
  const students = await Student.find();
  return res
    .status(200)
    .json(new ApiResponse(200, "Students fetched successfully", students));
});

const getStudentsByCourseSemester = asyncHandler(async (req, res) => {
  const students = await Student.find({course: req.params.course , semester: req.params.semester}).populate("user", ("-password", "-refreshToken"));
  return res
    .status(200)
    .json(new ApiResponse(200, "Students fetched successfully", students));
});

const getStudent = asyncHandler(async (req, res) => {
  const student = await Student.find({user: req.user._id}).populate("user", ("-password", "-refreshToken"));
  if (!student) {
    throw new ApiError(404, "Student not found");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, "Student fetched successfully", student));
});

const createStudent = asyncHandler(async (req, res) => {
  const { course, semester, roll_no, reg_no, enrollment_year } = req.body;

  if (!course || !semester || !roll_no || !reg_no || !enrollment_year) {
    throw new ApiError(400, "All fields are required");
  }

  const existedStudent = await Student.findOne({ email });
  if (existedStudent) {
    throw new ApiError(409, "Email already exists");
  }

  const student = await Student.create({
    user: req.user_id,
    course,
    semester,
    roll_no,
    reg_no,
    enrollment_year,
  });

  if (!student) {
    throw new ApiError(500, "Failed to create student");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Student created successfully", student));
});

const updateStudent = asyncHandler(async (req, res) => {
  const updates = req.body;

  const student = await Student.findByIdAndUpdate(
    {
      _id: req.user._id,
    },
    updates,
    { new: true }
  );

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Student updated successfully", student));
});

const deleteStudent = asyncHandler(async (req, res) => {

  const student = await Student.findByIdAndDelete({_id: req.params});

  if (!student) {
    throw new ApiError(404, "Student not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Student deleted successfully"));
});

module.exports = {
  getStudents,
  getStudent,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentsByCourseSemester
};
