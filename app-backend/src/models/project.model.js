const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema({
    course: {
        type: String,
        enum: ["bca", "mca"],
        required: true
    },
    semester: {
        type: Number,
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    project_name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    project_link: {
        type: String,
    },
    files: [{
        type: String,
    }],
}, { timestamps: true });

module.exports = mongoose.model("Project", projectSchema);
