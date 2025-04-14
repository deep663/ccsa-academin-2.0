const express = require("express");
const { submitProject, getProjectSubmissions, getStudentProjects, deleteProjectSubmission } = require("../controllers/project.controller");
const verifyJWT = require("../middlewares/auth.middleware");
const upload = require("../middlewares/multer.middleware");
const router = express.Router();

router.route("/:course/:semester").get(verifyJWT, getProjectSubmissions);
router.route("/:studentId").get(verifyJWT, getStudentProjects);
router.route("/").post( upload.array("files", 10), verifyJWT, submitProject);
router.route("/:id").delete(verifyJWT, deleteProjectSubmission);


module.exports = router;
