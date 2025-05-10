const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware.js");
const roleMiddleware = require("../middlewares/access.middleware.js");
const upload = require("../middlewares/multer.middleware.js");
const { getAssignmentsByTeacherId, createAssignment, updateAssignment, deleteAssignment, getAssignments, getTotalAssignments, getAssignmentReminders } = require("../controllers/assignment.controller.js");



router.route("/:course/:semester").get(verifyJWT, getAssignments);
router.route("/:teacherId").get(verifyJWT, getAssignmentsByTeacherId);
router.route("/").post( upload.array("files", 10), verifyJWT,  roleMiddleware(["teacher"]), createAssignment);
router.route("/:id").patch(verifyJWT, roleMiddleware(["teacher"]), updateAssignment);
router.route("/:id").delete(verifyJWT, roleMiddleware(["teacher"]), deleteAssignment);
router.route("/count/:teacherId").get(verifyJWT, roleMiddleware(["teacher"]), getTotalAssignments);
router.route("/reminders/:course/:semester").get(verifyJWT, getAssignmentReminders);


module.exports = router;