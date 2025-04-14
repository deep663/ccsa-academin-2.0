const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware.js");
const roleMiddleware = require("../middlewares/access.middleware.js");
const {
    getTeachers,
    getTeacher,
    createTeacher,
    updateTeacher,
    deleteTeacher
} = require("../controllers/teacher.controller.js");

router.route("/").get(verifyJWT, roleMiddleware(["admin"]), getTeachers);
router.route("/").post(verifyJWT, roleMiddleware(["teacher"]), createTeacher);
router.route("/teacher").get(verifyJWT, roleMiddleware(["teacher"]), getTeacher);
router.route("/:id").patch(verifyJWT, roleMiddleware(["teacher"]), updateTeacher);
router.route("/:id").delete(verifyJWT, roleMiddleware(["admin", "teacher"]), deleteTeacher);

module.exports = router;