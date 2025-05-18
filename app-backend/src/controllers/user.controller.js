const User = require("../models/user.model.js");
const Teacher = require("../models/teacher.model.js");
const Student = require("../models/student.model.js");
const ApiError = require("../utils/ApiError.js");
const ApiResponse = require("../utils/ApiResponse.js");
const jwt = require("jsonwebtoken");
const uploadOnCloudinary = require("../utils/cloudinaryConfig.js");
const asyncHandler = require("../utils/asyncHandler.js");

const options = {
  httpOnly: true,
  secure: true,
};

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    // console.log(user);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log(refreshToken);

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating tokens");
  }
};

const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  return res
    .status(200)
    .json(new ApiResponse(200, "Users fetched successfully", users));
});

const registerUser = asyncHandler(async (req, res) => {
  // console.log(req.body);
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    throw new ApiError(400, "All fields are required");
  }

  if (role === "admin") {
    throw new ApiError(400, "Admin role is not allowed");
  }

  const existedUser = await User.findOne({ email });

  if (existedUser) {
    throw new ApiError(409, "Email already exist!");
  }

  const avatar = req.file && `${req.protocol}://${req.get("host")}/uploads/${file?.filename}` || "";

  const user = await User.create({
    name,
    email,
    password,
    avatar: avatar|| "",
    role,
  });

  //create Teacher or Student
  if (role === "teacher") {
    await Teacher.create({
      user: user._id,
    });
  } else if (role === "student") {
    await Student.create({
      user: user._id,
    });
  }

  if (!user) {
    throw new ApiError(500, "Something went wrong while creating the user!");
  }

  return res
    .status(201)
    .json(new ApiResponse(201, "User created successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email and password required!");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const isPassValid = await user.isPasswordCorrect(password);

  if (!isPassValid) {
    throw new ApiError(401, "Invalid user credentials");
  }


  if (!user.isVerified && user.role !== "admin") {
    throw new ApiError(401, "User is not verified ! Please verify your account");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const varifiedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "User logged in successfully", varifiedUser));
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, "User log out successfully"));
});

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Refresh token not found");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id);

    if (!user) {
      throw new ApiError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Refresh token expired");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    // console.log(newAccessToken, newRefreshToken);

    return res
      .status(200)
      .cookie("accessToken", accessToken)
      .cookie("refreshToken", refreshToken)
      .json(
        new ApiResponse(200, "AccessToken refreshed successfully", {
          accessToken: accessToken,
          refreshToken: refreshToken,
        })
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "something went wrong");
  }
});

const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new ApiError(400, "Please provide old and new password");
  }

  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid old password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, "Password changed successfully"));
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res.status(200).json(new ApiResponse(200, "Success", req.user));
});

const updateAccountDetails = asyncHandler(async (req, res) => {
  const { email, fullname, phone } = req.body;

  if (!email && !fullname && !phone) {
    throw new ApiError(400, "At least one field is required to update.");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        fullname,
        email,
        phone,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, "Account details updated successfully", user));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new ApiError(400, "Please upload an image");
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar.url) {
    throw new ApiError(400, "Error while uploading avatar");
  }

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatar.url,
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new ApiResponse(200, "Avatar updated successfully", user));
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  if (user.role === "admin") {
    throw new ApiError(400, "Admin role is not allowed");
  } else if (user.role === "teacher") {
    await Teacher.findOneAndDelete({ user: req.params.userId });
  } else if (user.role === "student") {
    await Student.findOneAndDelete({ user: req.params.userId });
  }

  await User.findByIdAndDelete(user._id);
  return res
    .status(200)
    .json(new ApiResponse(200, "User deleted successfully"));
});

const verifyUser = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const updatedUser = await User.findByIdAndUpdate(
    userId,
    {
      $set: {
        isVerified: user.isVerified ? false : true,
      },
    },
    { new: true }
  ).select("-password -refreshToken");


  return res
    .status(200)
    .json(new ApiResponse(200, "User verified successfully", {user: updatedUser}));
});

const getUsersCount = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments({isVerified: true});
  const totalStudents = await User.countDocuments({role: "student", isVerified: true}); 
  const totalTeachers = await User.countDocuments({role: "teacher", isVerified: true});
  const unVerifiedUsers = await User.countDocuments({isVerified: false});

  const data = {
    totalUsers,
    totalStudents,
    totalTeachers,
    unVerifiedUsers,
  };

  return res
    .status(200)
    .json(new ApiResponse(200, "Total users fetched successfully", data));
});

module.exports = {
  getUsers,
  getUsersCount,
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  getCurrentUser,
  updateAccountDetails,
  updateUserAvatar,
  deleteUser,
  verifyUser,
};
