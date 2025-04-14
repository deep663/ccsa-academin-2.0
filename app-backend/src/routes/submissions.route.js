const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware.js");
const roleMiddleware = require("../middlewares/access.middleware.js");
const upload = require("../middlewares/multer.middleware.js");
const { submitAssignment, getSubmissionsbyAssignment, getStudentSubmissions } = require("../controllers/submitted_assignment.controller.js");

//Submissions
router.route("/").post( upload.array("files", 10), verifyJWT, submitAssignment);
router.route("/:studentId").get(verifyJWT, getStudentSubmissions);
router.route("/:assignId").get(verifyJWT, getSubmissionsbyAssignment);

module.exports = router;