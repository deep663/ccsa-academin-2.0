const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
    {
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject",
            required: true
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
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
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        due_date:{
            type: Date,
            required: true
        },
        files: [{
            type: String,
        }]
    },
    {timestamps: true})

    module.exports = mongoose.model("Assignment", assignmentSchema)