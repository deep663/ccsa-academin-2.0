const Project = require("../models/project.model.js");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

// @desc    Submit a project
// @route   POST /api/projects
// @access  Student
const submitProject = asyncHandler(async (req, res) => {
  const {
    course,
    semester,
    student,
    project_name,
    description,
    project_link,
    files,
  } = req.body;

  if (!course || !semester || !student || !project_name || !description) {
    throw new ApiError(400, "All fields are required");
  }

  if (!req.files) {
    throw new ApiError(400, "Missing required fields: files");
  }

  const fileLinks = req.files.map((file) => {
    return `${req.protocol}://${req.get("host")}/uploads/${file.filename}`;
  });

  const project = await Project.create({
    course,
    semester,
    student,
    project_name,
    description,
    project_link,
    files: fileLinks,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, project, "Project submitted successfully"));
});

const getProjectSubmissions = asyncHandler(async (req, res) => {
  const projectSubmissions = await Project.find({
    course: req.params.course,
    semester: req.params.semester,
  }).populate({
    path: "student",
    select: "_id user roll_no",
    populate: {
      path: "user",
      model: "User",
      select: "name",
      select: ("-password", "-refreshToken"),
    },
  });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Project submissions fetched successfully",
        projectSubmissions
      )
    );
});

const getStudentProjects = asyncHandler(async (req, res) => {
  const studentProjects = await Project.find({ student: req.params.studentId });
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        "Student projects fetched successfully",
        studentProjects
      )
    );
});

const deleteProjectSubmission = asyncHandler(async (req, res) => {
  const project = await Project.findById(req.params.id);
  if (!project) throw new ApiError(404, "Project not found");

  await project.deleteOne();
  return res.status(200).json(new ApiResponse(200, {}, "Deleted successfully"));
});

module.exports = {
  submitProject,
  getStudentProjects,
  getProjectSubmissions,
  deleteProjectSubmission,
};
