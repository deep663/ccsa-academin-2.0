import { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
  TableSortLabel,
  TablePagination,
  Select,
  MenuItem,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import InlineLoader from "../InlineLoader";
import Toaster from "../Toaster";
import { useSelector } from "react-redux";
import {
  createAssignment,
  deleteAssignment,
  getAssignmentsByTeacher,
  getTeacherSubjects,
  updateAssignment,
} from "../../utils/api";

const ManageAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const courses = ["bca", "mca"];
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filter, setFilter] = useState({
    course: "",
    semester: "",
    subject: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "dueDate",
    direction: "desc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [newAssignment, setNewAssignment] = useState({
    title: "",
    description: "",
    dueDate: "",
    files: [],
  });
  const [editAssignment, setEditAssignment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const user = useSelector((s) => s.user.fields);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      setLoading(true);
      const response = await getAssignmentsByTeacher(user?.roleId);
      setAssignments(response.data.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (course) => {
    setSemesters([]);
    setSubjects([]);
    if (!course) return;
    setSemesters(course === "bca" ? [1, 2, 3, 4, 5, 6] : [1, 2, 3, 4]);
  };

  const fetchSubjects = async (semester) => {
    setSubjects([]);
    if (!semester) return;
    try {
      setLoading(true);
      const response = await getTeacherSubjects(
        user?.roleId,
        semester,
        filter.course
      );
      setSubjects(response.data.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));

    if (name === "course") fetchSemesters(value);
    if (name === "semester") fetchSubjects(value);
  };

  const handleAddOrEditAssignment = async () => {
    const formData = new FormData();

    formData.append("title", newAssignment.title);
    formData.append("description", newAssignment.description);
    formData.append("due_date", newAssignment.dueDate);
    formData.append("teacher", user?.roleId);
    formData.append("subject", filter.subject);
    formData.append("semester", filter.semester);
    formData.append("course", filter.course);

    newAssignment.files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);
      if (editAssignment) {
        await updateAssignment(editAssignment._id, formData);
      } else {
        await createAssignment(formData);
      }
      setToast({
        show: true,
        message: "Assignment added successfully",
        type: "success",
      });
      fetchAssignments();
      setOpenDialog(false);
      setNewAssignment({
        title: "",
        description: "",
        dueDate: "",
        files: [],
      });
      setEditAssignment(null);
    } catch (err) {
      console.error("Error saving assignment:", err);
      setToast({
        show: true,
        message: "Failed to add the assignment.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAssignment = async (id) => {
    if (window.confirm("Are you sure you want to delete this assignment?")) {
      try {
        setLoading(true);
        await deleteAssignment(id);
        fetchAssignments();
      } catch (err) {
        console.error("Error deleting assignment:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredAssignments = assignments
    .filter(
      (a) =>
        (!filter.course || a.course === filter.course) &&
        (!filter.semester || a.semester === Number(filter.semester)) &&
        (!filter.subject || a.subject._id === filter.subject)
    )
    .sort((a, b) =>
      sortConfig.direction === "asc"
        ? a[sortConfig.key] > b[sortConfig.key]
        : a[sortConfig.key] < b[sortConfig.key]
    );

  if (loading) return <InlineLoader />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Assignments</h2>

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
          <MenuItem value="">All Courses</MenuItem>
          {courses.map((course, idx) => (
            <MenuItem key={idx} value={course}>
              {course.toUpperCase()}
            </MenuItem>
          ))}
        </Select>

        <Select
          name="semester"
          value={filter.semester}
          onChange={handleFilterChange}
          displayEmpty
        >
          <MenuItem value="">All Semesters</MenuItem>
          {semesters.map((sem) => (
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
          <MenuItem value="">All Subjects</MenuItem>
          {subjects.map((sub) => (
            <MenuItem key={sub._id} value={sub._id}>
              {sub.name}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Upload Assignment
        </Button>
      </div>

      {/* Assignments Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["title", "subject", "dueDate"].map((key) => (
                <TableCell key={key}>
                  <TableSortLabel
                    active={sortConfig.key === key}
                    direction={sortConfig.direction}
                    onClick={() => handleSort(key)}
                  >
                    {key.toUpperCase()}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAssignments.map((a) => (
              <TableRow key={a._id}>
                <TableCell>{a.title}</TableCell>
                <TableCell>{a.subject.name}</TableCell>
                <TableCell>
                  {new Date(a.due_date).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <Button
                    onClick={() => {
                      setEditAssignment(a);
                      setNewAssignment(a);
                      setOpenDialog(true);
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleDeleteAssignment(a._id)}
                    color="error"
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={filteredAssignments.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPageOptions={[5, 10, 15]}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
      />

      {/* Add/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>
          {editAssignment ? "Edit Assignment" : "Add Assignment"}
        </DialogTitle>
        <DialogContent className="space-y-4 w-lg">
          <div className="flex flex-col gap-4 py-2">
            <TextField
              label="Title"
              fullWidth
              value={newAssignment.title}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, title: e.target.value })
              }
            />
            <TextField
              label="Description"
              fullWidth
              multiline
              rows={3}
              value={newAssignment.description}
              onChange={(e) =>
                setNewAssignment({
                  ...newAssignment,
                  description: e.target.value,
                })
              }
            />
            <TextField
              type="date"
              label="Due Date"
              fullWidth
              value={newAssignment.dueDate}
              onChange={(e) =>
                setNewAssignment({ ...newAssignment, dueDate: e.target.value })
              }
              InputLabelProps={{ shrink: true }}
            />
          </div>
          <div className="border border-gray-400 p-4 rounded">
            <input
              type="file"
              onChange={(e) =>
                setNewAssignment({
                  ...newAssignment,
                  files: Array.from(e.target.files),
                })
              }
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleAddOrEditAssignment}
            variant="contained"
            color="primary"
          >
            {editAssignment ? "Update" : "Add"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageAssignments;
