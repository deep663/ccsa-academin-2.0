import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  getMarksBySubject,
  deleteMarks,
  getTeacherSubjects,
  getStudents,
  addMarksMultiple,
} from "../../utils/api";
import InlineLoader from "../InlineLoader";
import Toaster from "../Toaster";
import { useSelector } from "react-redux";

const ManageMarks = () => {
  const user = useSelector((state) => state.user.fields);
  const [marks, setMarks] = useState([]);
  const [students, setStudents] = useState([]);
  const [studentMarks, setStudentMarks] = useState([]);
  const [semester, setSemester] = useState([]);
  const [subject, setSubject] = useState([]);
  const [examType, setExamType] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [editMark, setEditMark] = useState(null);
  const [filter, setFilter] = useState({
    course: "",
    semester: "",
    subject: "",
  });
  const [newMark, setNewMark] = useState({
    title: "",
    student: "",
    marks: "",
    total_marks: "",
    course: "",
    semester: "",
    subject: "",
    exam_type: "",
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });

  const fetchMarks = async () => {
    if (!filter.course || !filter.semester || !filter.subject || !examType)
      return;
    try {
      setLoading(true);
      const response = await getMarksBySubject(
        filter.course,
        filter.semester,
        filter.subject,
        examType
      );
      setMarks(response.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (course) => {
    setSemester([]); // Reset on course change
    setSubject([]);
    if (!course) return;
    if (course === "bca") {
      setSemester([1, 2, 3, 4, 5, 6, 7, 8]);
    } else if (course === "mca") {
      setSemester([1, 2, 3, 4]);
    }
  };

  const fetchSubjects = async (semester) => {
    setSubject([]);
    if (!semester) return;
    try {
      setLoading(true);
      const response = await getTeacherSubjects(
        user?.roleId,
        semester,
        filter.course
      );
      setSubject(response.data.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    if (!filter.course || !filter.semester) return;
    try {
      const response = await getStudents(filter.course, filter.semester);
      setStudents(response.data.data);
      setStudentMarks(
        response.data.data.map((s) => ({ student: s._id, marks: "" }))
      );
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMarks();
  }, [examType, filter.course, filter.semester, filter.subject]);

  useEffect(() => {
    if (openDialog && !editMark) {
      fetchStudents();
    }
  }, [openDialog, filter.course, filter.semester]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    if (name === "course") fetchSemesters(value);
    if (name === "semester") fetchSubjects(value);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure to delete this entry?")) {
      try {
        await deleteMarks(id);
        setToast({ show: true, message: "Deleted", type: "error" });
        fetchMarks();
      } catch (err) {
        setToast({ show: true, message: "Delete failed", type: "error" });
        console.log(err);
      }
    }
  };

  const handleSubmit = async () => {
    {
      const payload = {
        title: newMark.title,
        total_marks: newMark.total_marks,
        course: filter.course,
        semester: filter.semester,
        subject: filter.subject,
        exam_type: examType,
        marks: studentMarks,
      };
      try {
        setLoading(true);
        await addMarksMultiple(payload);
        setToast({
          show: true,
          message: "Marks added",
          type: "success",
        });
        setOpenDialog(false);
        fetchMarks();
      } catch (err) {
        console.error(err);
        setToast({
          show: true,
          message: "Error adding marks",
          type: "error",
        });
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <InlineLoader />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Marks</h2>

      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false })}
        />
      )}

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <Select
          name="course"
          value={filter.course}
          onChange={handleFilterChange}
          displayEmpty
        >
          <MenuItem value="">Select Course</MenuItem>
          <MenuItem value="bca">BCA</MenuItem>
          <MenuItem value="mca">MCA</MenuItem>
        </Select>

        <Select
          name="semester"
          value={filter.semester}
          onChange={handleFilterChange}
          displayEmpty
        >
          <MenuItem value="">Select Semester</MenuItem>
          {semester.map((sem) => (
            <MenuItem key={sem} value={sem}>
              Semester {sem}
            </MenuItem>
          ))}
        </Select>

        <Select
          name="subject"
          value={filter.subject}
          onChange={handleFilterChange}
          displayEmpty
        >
          <MenuItem value="">Select Subject</MenuItem>
          {subject.map((sub, idx) => (
            <MenuItem key={idx} value={sub._id}>
              {sub.name}
            </MenuItem>
          ))}
        </Select>

        <Select
          value={examType}
          onChange={(e) => setExamType(e.target.value)}
          displayEmpty
        >
          <MenuItem value="">Exam Type</MenuItem>
          <MenuItem value="insem">In-Sem</MenuItem>
          <MenuItem value="endsem">End-Sem</MenuItem>
          <MenuItem value="project">Project</MenuItem>
        </Select>

        <Button
          variant="contained"
          onClick={() => {
            setEditMark(null);
            setNewMark({
              title: "",
              student: "",
              marks: "",
              total_marks: "",
              course: "",
              semester: "",
              subject: "",
              exam_type: "",
            });
            setOpenDialog(true);
          }}
        >
          Add Mark
        </Button>
      </div>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Marks</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Exam Type</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {marks.map((m) => (
              <TableRow key={m._id}>
                <TableCell>{m.title}</TableCell>
                <TableCell>{m.student?.roll_no}</TableCell>
                <TableCell>{m.marks}</TableCell>
                <TableCell>{m.total_marks}</TableCell>
                <TableCell>{m.exam_type}</TableCell>
                <TableCell>
                  <Button color="error" onClick={() => handleDelete(m._id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Dialog */}
      {/* Bulk Add Marks Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Add Marks for All Students</DialogTitle>

        <DialogContent className="flex flex-col gap-4 mt-4">
          {/* Title and Total Marks */}
          <div className="flex gap-4">
            <TextField
              label="Title"
              value={newMark.title}
              onChange={(e) =>
                setNewMark({ ...newMark, title: e.target.value })
              }
              fullWidth
            />
            <TextField
              label="Total Marks"
              value={newMark.total_marks}
              onChange={(e) =>
                setNewMark({ ...newMark, total_marks: e.target.value })
              }
              fullWidth
            />
          </div>

          {/* Marks List Table */}
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Roll No</TableCell>
                  <TableCell>Student Name</TableCell>
                  <TableCell>Marks Obtained</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student, idx) => (
                  <TableRow key={student._id}>
                    <TableCell>{student.roll_no}</TableCell>
                    <TableCell>{student.user.name}</TableCell>
                    <TableCell>
                      <TextField
                        type="text"
                        value={studentMarks[idx]?.marks || ""}
                        onChange={(e) => {
                          const updated = [...studentMarks];
                          updated[idx] = {
                            student: student._id,
                            marks: e.target.value,
                          };
                          setStudentMarks(updated);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>

        <DialogActions>
          <Button variant="contained" onClick={handleSubmit}>
            Submit All
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageMarks;
