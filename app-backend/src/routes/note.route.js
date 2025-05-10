//note routes

const router = require("express").Router();
const verifyJWT = require("../middlewares/auth.middleware.js");
const roleMiddleware = require("../middlewares/access.middleware.js");
const {
    createNote,
    getNotes,
    getNotesByTeacherId,
    getNotesBySubjectId,
    updateNote,
    deleteNote,
    getTotalNotes,
    getRecentNotesUpdates
} = require("../controllers/note.controller.js");
const upload = require("../middlewares/multer.middleware.js");

router.route("/").get(verifyJWT, getNotes);
router.route("/:teacherId").get(verifyJWT, getNotesByTeacherId);
router.route("/subject/:subjectId").get(verifyJWT, getNotesBySubjectId);
router.route("/").post( upload.array("files", 10), verifyJWT,  roleMiddleware(["teacher"]), createNote);
router.route("/:id").patch(verifyJWT, roleMiddleware(["teacher"]), updateNote);
router.route("/:id").delete(verifyJWT, roleMiddleware(["teacher"]), deleteNote);
router.route("/count/:teacherId").get(verifyJWT, roleMiddleware(["teacher"]), getTotalNotes);
router.route("/recent-updates/:course:semester").get(verifyJWT, getRecentNotesUpdates);


module.exports = router;