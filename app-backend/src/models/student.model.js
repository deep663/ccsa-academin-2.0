const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        course: {
            type: String,
            enum: ['bca', 'mca']
        },
        semester: {
            type: Number
        },
        roll_no: {
            type: String,
        },
        reg_no: {
            type: String,
            unique: true,
        },
        enrollment_year: {
            type: Number,
        }
    },{timestamps: true})

module.exports = mongoose.model("Student", studentSchema);