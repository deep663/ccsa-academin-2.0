const mongoose = require("mongoose");

const markSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    course: {
        type: String,
        enum: ["bca", "mca"],
        required: true
    },
    marks: {
        type: String,
        required: true
    },
    total_marks: {
        type: String,
        required: true
    },
    exam_type: {
        type: String,
        enum: ["insem", "endsem", "project"],
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model("Mark", markSchema);