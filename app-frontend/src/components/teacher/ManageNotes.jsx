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
import {
  createNote,
  deleteNote,
  getNotesByTeacher,
  getTeacherSubjects,
  updateNote,
} from "../../utils/api";
import InlineLoader from "../InlineLoader";
import Toaster from "../Toaster";
import { useSelector } from "react-redux";

const ManageNotes = () => {
  const [notes, setNotes] = useState([]);
  const courses = ["bca", "mca"];
  const [semesters, setSemesters] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [filter, setFilter] = useState({
    course: "",
    semester: "",
    subject: "",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "createdAt",
    direction: "desc",
  });
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openDialog, setOpenDialog] = useState(false);
  const [newNote, setNewNote] = useState({
    title: "",
    content: "",
    files: [],
  });
  const [editNote, setEditNote] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const user = useSelector((s) => s.user.fields);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await getNotesByTeacher(user?.roleId);
      setNotes(response.data.data);
    } catch (err) {
      console.error("Error fetching notes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (course) => {
    setSemesters([]); // Reset on course change
    setSubjects([]);
    if (!course) return;
    if (course === "bca") {
      setSemesters([1, 2, 3, 4, 5, 6, 7, 8]);
    } else if (course === "mca") {
      setSemesters([1, 2, 3, 4]);
    }
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

  const handleAddOrEditNote = async () => {
    const formData = new FormData();

    formData.append("title", newNote.title);
    formData.append("content", newNote.content);
    formData.append("teacher", user?.roleId);
    formData.append("subject", filter.subject);
    formData.append("semester", filter.semester);
    formData.append("course", filter.course);

    // Append each file
    newNote.files.forEach((file) => {
      formData.append("files", file);
    });
    try {
      setLoading(true);
      if (editNote) {
        await updateNote(editNote._id, formData);
      } else {
        await createNote(formData);
      }
      setToast({
        show: true,
        message: "Note added successfully",
        type: "success",
      });
      fetchNotes();
      setOpenDialog(false);
      setNewNote({
        title: "",
        content: "",
        files: [],
      });
      setEditNote(null);
    } catch (err) {
      console.error("Error saving note:", err);
      setToast({
        show: true,
        message: "Failed to add the subject.",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      try {
        setLoading(true);
        await deleteNote(id);
        fetchNotes();
      } catch (err) {
        console.error("Error deleting note:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const filteredNotes = notes
    .filter(
      (note) =>
        (filter.course ? note.course === filter.course : true) &&
        (filter.semester ? note.semester === Number(filter.semester) : true) &&
        (filter.subject ? note.subject._id === filter.subject : true)
    )
    .sort((a, b) =>
      sortConfig.direction === "asc"
        ? a[sortConfig.key] > b[sortConfig.key]
        : a[sortConfig.key] < b[sortConfig.key]
    );

  if (loading) return <InlineLoader />;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Manage Notes</h2>

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
          {subjects.map((sub, idx) => (
            <MenuItem key={idx} value={sub._id}>
              {sub.name}
            </MenuItem>
          ))}
        </Select>

        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenDialog(true)}
        >
          Upload Note
        </Button>
      </div>

      {/* Notes Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {["title", "subject", "semester", "createdAt"].map((key) => (
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
            {filteredNotes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((note) => (
                <TableRow key={note._id}>
                  <TableCell>{note.title}</TableCell>
                  <TableCell>{note.subject.name}</TableCell>
                  <TableCell>{note.semester}</TableCell>
                  <TableCell>
                    {new Date(note.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => {
                        setEditNote(note);
                        setNewNote(note);
                        setOpenDialog(true);
                      }}
                    >
                      Edit
                    </Button>
                    <Button
                      color="error"
                      onClick={() => handleDeleteNote(note._id)}
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
        count={filteredNotes.length}
        page={page}
        rowsPerPage={rowsPerPage}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPageOptions={[5, 10, 15]}
        onRowsPerPageChange={(e) =>
          setRowsPerPage(parseInt(e.target.value, 10))
        }
      />

      {/* Upload/Edit Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>{editNote ? "Edit Note" : "Upload Note"}</DialogTitle>
        <DialogContent className="space-y-4 w-lg">
          <div className="flex flex-col gap-4 py-2">
            <TextField
              label="Title"
              fullWidth
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
            />

            <TextField
              label="Content"
              fullWidth
              multiline
              rows={3}
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
            />
          </div>
          <div className="border border-gray-400 p-4 rounded">
            <input
              type="file"
              onChange={(e) =>
                setNewNote({ ...newNote, files: Array.from(e.target.files) })
              }
              multiple
              max={10}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleAddOrEditNote}
            color="primary"
          >
            {editNote ? "Update" : "Upload"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ManageNotes;