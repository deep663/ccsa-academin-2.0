const mongoose = require("mongoose");

const submittedAssignmentSchema = new mongoose.Schema({
    assignment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment",
        required: true
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    files: [{
        type: String,
        required: true
    }]
},{timestamps: true})

module.exports = mongoose.model("SubmittedAssignment", submittedAssignmentSchema);