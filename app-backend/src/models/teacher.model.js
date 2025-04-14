const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        teacher_code: {
            type: String,
        }
    },{timestamps: true})

module.exports = mongoose.model("Teacher", teacherSchema);
