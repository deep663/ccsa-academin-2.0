const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    teacher_code: {
      type: String
    },
    designation: {
      type: String
    },
    expertise: {
      type: String
    },
    educational_qualifications: [
      {
        degree: {
          type: String
        },
        institution: {
          type: String
        }
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);