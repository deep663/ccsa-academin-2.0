const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware.js");
const roleMiddleware = require("../middlewares/access.middleware.js");
const {
    getSubjects,
    createSubject,
    updateSubject,
    deleteSubject,
    getSemesterSubjects,
    getTeacherSubjects,
    getTotalSubjects
} = require("../controllers/subject.controller.js");

router.route("/").get(verifyJWT, getSubjects);
router.route("/:course/:semester").get(verifyJWT, getSemesterSubjects);
router.route("/:course/:semester/:teacherId").get(verifyJWT, roleMiddleware(["teacher"]), getTeacherSubjects);
router.route("/").post(verifyJWT, roleMiddleware(["admin","teacher"]), createSubject);
router.route("/:id").patch(verifyJWT, roleMiddleware(["admin","teacher"]), updateSubject);
router.route("/:id").delete(verifyJWT, roleMiddleware(["admin", "teacher"]), deleteSubject);
router.route("/count").get(verifyJWT, roleMiddleware(["admin"]), getTotalSubjects);

module.exports = router;

