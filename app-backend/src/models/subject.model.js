const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        tolowercase: true,
        required: true
    },
    code: {
        type: String,
        required: true
    },
    teacher: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Teacher",
        required: true
    },
    type: {
      type: String,
      enum: ["theory", "practical"],
      required: true  
    },
    semester: {
        type: Number,
        enum: [1,2,3,4,5,6,7,8],
        required: true
    },
    course: {
        type: String,
        enum: ["bca", "mca"],
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model("Subject", subjectSchema);