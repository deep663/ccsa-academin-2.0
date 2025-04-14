const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema({
    contenet: {
        type: String,
        required: true
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Semester",
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject"
    },
    file: {
        type: String,
    }

},{timestamps: true})

module.exports = mongoose.model("Attendance", attendanceSchema)