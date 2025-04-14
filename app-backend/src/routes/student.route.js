const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware.js");
const roleMiddleware = require("../middlewares/access.middleware.js");
const {
    getStudents,
    getStudent,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentsByCourseSemester
} = require("../controllers/student.controller.js");

router.route("/all").get(verifyJWT, roleMiddleware(["admin", "teacher"]), getStudents);
router.route("/:course/:semester").get(verifyJWT, roleMiddleware(["teacher"]), getStudentsByCourseSemester);
router.route("/").post(verifyJWT, roleMiddleware(["student"]), createStudent);
router.route("/").get(verifyJWT, getStudent);
router.route("/:id").patch(verifyJWT, roleMiddleware(["student"]), updateStudent);
router.route("/:id").delete(verifyJWT, roleMiddleware(["admin", "student"]), deleteStudent);

module.exports = router;