const User = require("../models/user.model.js");
const Student = require("../models/student.model.js");
const Teacher = require("../models/teacher.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const asyncHandler = require("../utils/asyncHandler.js");
const fs = require('fs');
const path = require('path');

//Get Profile
const getProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await User.findById(userId)
    .select("-password -refreshToken")
    .lean();

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  let profileData = { ...user };

  if (user.role === "student") {
    const studentDetails = await Student.findOne({ user: userId }).lean();
    if (!studentDetails) {
      throw new ApiError(404, "Student data not found");
    }
    profileData = { ...profileData, ...studentDetails };
  }

  if (user.role === "teacher") {
    const teacherDetails = await Teacher.findOne({ user: userId }).lean();
    if (!teacherDetails) {
      throw new ApiError(404, "Teacher data not found");
    }
    profileData = { ...profileData, ...teacherDetails };
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile fetched successfully", profileData,));
});

// POST /edit-profile
const editProfile = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const {
    name,
    phone,
    roll_no,
    reg_no,
    course,
    semester,
    enrollment_year,
    teacher_code,
  } = req.body;

  // console.log(req);
  if (req.file) {
    avatar = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  }

  const user = await User.findById(userId);
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // === Update user base info ===
  if (name) user.name = name;
  if (phone) user.phone = phone;
  await user.save();
  if (req.file) {
    const oldAvatar = user.avatar;
    const avatar = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
  
    // Update user avatar
    user.avatar = avatar;
    await user.save();
  
    // Delete old avatar
    if (oldAvatar) {
      const oldAvatarPath = path.join(__dirname, `../../public/uploads/${oldAvatar.split('/uploads/')[1]}`);
      if (fs.existsSync(oldAvatarPath)) {
        fs.unlinkSync(oldAvatarPath);
      }
    }
  } else await user.save();

  // === Update role-specific details ===
  if (user.role === "student") {
    let student = await Student.findOne({ user: userId });
    if (!student) {
      throw new ApiError(404, "Student record not found");
    }
    if (roll_no) student.roll_no = roll_no;
    if (reg_no) student.reg_no = reg_no;
    if (course) student.course = course;
    if (semester !== undefined) student.semester = semester;
    if (enrollment_year) student.enrollment_year = enrollment_year;
    await student.save();
  }

  if (user.role === "teacher") {
    let teacher = await Teacher.findOne({ user: userId });
    if (!teacher) {
      throw new ApiError(404, "Teacher record not found");
    }
    if (teacher_code) teacher.teacher_code = teacher_code;
    await teacher.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, "Profile updated successfully"));
});

module.exports = {
  getProfile,
  editProfile,
};
