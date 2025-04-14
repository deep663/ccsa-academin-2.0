const express = require("express");
const router = express.Router();
const verifyJWT = require("../middlewares/auth.middleware.js");
const roleMiddleware = require("../middlewares/access.middleware.js");
const { createMark, getMarks, getMarkById, updateMark, deleteMark, addMultipleMarks, getMarksBySubjectId } = require("../controllers/mark.controller.js");

// CRUD routes for marks
router.route("/").post(verifyJWT, roleMiddleware(["teacher"]), createMark);
router.route("/").get(verifyJWT, getMarks);
router.route("/:studentId").get(verifyJWT, getMarkById);
router.route("/:course/:semester/:subject/:exam_type").get(verifyJWT, getMarksBySubjectId);
router.route("/:id").patch(verifyJWT, roleMiddleware(["teacher"]), updateMark);
router.route("/:id").delete(verifyJWT, roleMiddleware(["teacher"]), deleteMark);

// Add multiple marks for a specific subject and semester
router.route("/bulk").post( verifyJWT, roleMiddleware(["teacher"]), addMultipleMarks);

module.exports = router;
