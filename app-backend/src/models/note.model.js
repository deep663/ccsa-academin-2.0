const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        subject: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Subject"
        },
        teacher: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher"
        },
        title: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
        files: [{
            type: String
        }],
        semester: {
            type: Number

        },
        course: {
            type: String,
            enum: ["bca", "mca"]
        }
    },{timestamps: true})

    module.exports = mongoose.model("Note", noteSchema);