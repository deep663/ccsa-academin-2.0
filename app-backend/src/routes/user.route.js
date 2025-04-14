const router = require("express").Router();
const upload = require("../middlewares/multer.middleware.js");
const verifyJWT = require("../middlewares/auth.middleware.js");
const {
  registerUser,
  loginUser,
  logoutUser,
  changePassword,
  getCurrentUser,
  updateUserAvatar,
  updateAccountDetails,
  refreshAccessToken,
  deleteUser,
  verifyUser,
  getUsers,
} = require("../controllers/user.controller.js");
const roleMiddleware = require("../middlewares/access.middleware.js");
const { getProfile, editProfile } = require("../controllers/Profile.controller.js");

router.route("/register").post(upload.single("avatar"), registerUser);
router.route("/login").post(loginUser);

//secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/current-user").get(verifyJWT, getCurrentUser);
router.route("/get-users").get(verifyJWT, roleMiddleware(["admin"]), getUsers);
router.route("/profile").get(verifyJWT, getProfile);
router.route("/edit-profile").patch(verifyJWT, upload.single("avatar"), editProfile);
router.route("/change-password").patch(verifyJWT, changePassword);
router.route("/update-user-details").patch(verifyJWT, updateAccountDetails);
router
  .route("/update-avatar")
  .patch(upload.single("avatar"), verifyJWT, updateUserAvatar);
router.route("/refresh-token").post(refreshAccessToken);
router.route("/:userId").delete(verifyJWT, deleteUser);
router
  .route("/verify/:userId")
  .patch(verifyJWT, roleMiddleware(["admin"]), verifyUser);
router
  .route("/get-teachers")
  .patch(verifyJWT, roleMiddleware(["admin"]), verifyUser);

module.exports = router;
