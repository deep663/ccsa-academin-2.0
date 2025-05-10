const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware.js");
const roleMiddleware = require("../middlewares/access.middleware.js");
const upload = require("../middlewares/multer.middleware.js");
const { submitAssignment, getSubmissionsbyAssignment, getStudentSubmissions, getRecentSubmissions, getTodaysSubmissionsCount } = require("../controllers/submitted_assignment.controller.js");

//Submissions
router.route("/").post( upload.array("files", 10), verifyJWT, submitAssignment);
router.route("/s/:studentId").get(verifyJWT, getStudentSubmissions);
router.route("/a/:assignId").get(verifyJWT, getSubmissionsbyAssignment);
router.route("/recent/:teacherId").get(verifyJWT, getRecentSubmissions);
router.route("/today/:teacherId").get(verifyJWT, getTodaysSubmissionsCount);

module.exports = router;