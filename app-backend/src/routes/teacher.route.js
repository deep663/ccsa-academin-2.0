const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware.js");
const roleMiddleware = require("../middlewares/access.middleware.js");
const {
    getTeachers,
    getTeacher,
    updateTeacher,
    deleteTeacher
} = require("../controllers/teacher.controller.js");

router.route("/").get(verifyJWT , getTeachers);
router.route("/teacher").get(verifyJWT, roleMiddleware(["teacher"]), getTeacher);
router.route("/:id").patch(verifyJWT, roleMiddleware(["teacher"]), updateTeacher);
router.route("/:id").delete(verifyJWT, roleMiddleware(["admin", "teacher"]), deleteTeacher);

module.exports = router;