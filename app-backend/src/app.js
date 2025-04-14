const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

// app.use(cors());
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running.....");
});

app.use("/api/v1/users", require("./routes/user.route.js"));
app.use("/api/v1/teachers", require("./routes/teacher.route.js"));
app.use("/api/v1/students", require("./routes/student.route.js"));
app.use("/api/v1/subjects", require("./routes/subject.route.js"));
app.use("/api/v1/notes", require("./routes/note.route.js"));
app.use("/api/v1/assignments", require("./routes/assignment.route.js"));
app.use("/api/v1/marks", require("./routes/mark.route.js"));
app.use("/api/v1/submissions", require("./routes/submissions.route.js"));
app.use("/api/v1/projects", require("./routes/project.route.js"));

module.exports = app;
