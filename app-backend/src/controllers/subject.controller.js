const Subject = require("../models/subject.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");

const getSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.aggregate([
    {
      $lookup: {
        from: "teachers",
        localField: "teacher",
        foreignField: "_id",
        as: "teacher_info",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "user",
              foreignField: "_id",
              as: "user",
            },
          },
          {
            $addFields: {
              name: { $arrayElemAt: ["$user.name", 0] },
            },
          },

        ],
      },
    },
    {
      $addFields: {
        teacher_name: { $arrayElemAt: ["$teacher_info.name", 0] },
      },
    },
    {
      $unwind: "$teacher",
    },
    {
      $project:{
        _id: 1,
        name: 1,
        code: 1,
        teacher: 1,
        type: 1,
        semester: 1,
        course: 1,
        teacher_name: 1,
      }
    }
  ]);
  return res
    .status(200)
    .json(new ApiResponse(200, "Subjects fetched successfully", subjects));
});

const getSemesterSubjects = asyncHandler(async (req, res) => {
  const subjects = await Subject.find({
    semester: req.params.semester,
    course: req.params.course,
  }).populate({path:"teacher", populate:{ path: "user", model:  "User"}});
  return res
    .status(200)
    .json(
      new ApiResponse(200, "Semester subjects fetched successfully", subjects)
    );
});


const getTeacherSubjects = asyncHandler(async (req, res) => {
  
  const subjects = await Subject.find({
    teacher: req.params.teacherId,
    semester: req.params.semester,
    course: req.params.course
  });
  return res
    .status(200)
    .json(new ApiResponse(200, "Teacher subjects fetched successfully", subjects));
});

const createSubject = asyncHandler(async (req, res) => {
  const { name, type, code, teacher, semester, course } = req.body;

  if (!name || !type || !teacher || !semester || !course) {
    throw new ApiError(400, "All fields are required");
  }

  const existingSubject = await Subject.findOne({ name });
  if (existingSubject) {
    throw new ApiError(409, "Subject already exists");
  }

  const subject = await Subject.create({
    name,
    code,
    type,
    teacher,
    semester,
    course,
  });

  if (!subject) {
    throw new ApiError(500, "Failed to create subject");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "Subject created successfully", subject));
});

const updateSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const subject = await Subject.findByIdAndUpdate(id, updates, { new: true });

  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subject updated successfully", subject));
});

const deleteSubject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const subject = await Subject.findByIdAndDelete(id);

  if (!subject) {
    throw new ApiError(404, "Subject not found");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Subject deleted successfully"));
});

module.exports = {
  getSubjects,
  getSemesterSubjects,
  getTeacherSubjects,
  createSubject,
  updateSubject,
  deleteSubject,
};
