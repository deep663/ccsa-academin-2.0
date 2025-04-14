const ApiError = require("../utils/ApiError.js");
const asyncHandler = require("../utils/asyncHandler.js");

const roleMiddleware = (roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new ApiError(403, "Access denied"));
  }
  next();
};

module.exports = roleMiddleware;