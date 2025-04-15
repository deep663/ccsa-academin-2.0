import {
    Card,
    CardContent,
    CardActionArea,
    Typography,
    Grid2,
    Paper,
    List,
    ListItem,
    ListItemText,
    Divider,
    Box,
    Button,
    MenuItem,
    Select,
  } from "@mui/material";
  import { useState, useEffect } from "react";
  import {
    getAssignmentsByTeacher,
    getProjectSubmissions,
    getSubmissionsByAssignments,
    getTeacherSubjects,
  } from "../../utils/api";
  import { useSelector } from "react-redux";
  import InlineLoader from "../InlineLoader";
  
  const ViewSubmissions = () => {
    const [selectedType, setSelectedType] = useState(null);
    const [filters, setFilters] = useState({
      course: "",
      semester: "",
      subject: "",
    });
    const [assignments, setAssignments] = useState([]);
    const [selectedAssignmentId, setSelectedAssignmentId] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const user = useSelector((state) => state.user.fields);
    const [semesters, setSemesters] = useState([]);
    const [loading, setLoading] = useState(false);
  
    const fetchSubjects = async (semester) => {
      setSubjects([]);
      if (!semester) return;
      try {
        setLoading(true);
        const response = await getTeacherSubjects(
          user?.roleId,
          semester,
          filters.course
        );
        setSubjects(response.data.data);
      } catch (err) {
        console.error("Error fetching subjects:", err);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchSemesters = async (course) => {
      setSemesters([]);
      setSubjects([]);
      if (!course) return;
      setSemesters(course === "bca" ? [1, 2, 3, 4, 5, 6, 7, 8] : [1, 2, 3, 4]);
    };
  
    const fetchAssignments = async () => {
      try {
        setLoading(true);
        const res = await getAssignmentsByTeacher(user?.roleId);
        setAssignments(res.data.data || []);
      } catch (err) {
        console.error("Error fetching assignments:", err);
      } finally {
        setLoading(false);
      }
    };
  
    const loadSubmissionsForAssignment = async (assignmentId) => {
      try {
        setLoading(true);
        const res = await getSubmissionsByAssignments(assignmentId);
        setSubmissions(res.data.data || []);
        setSelectedAssignmentId(assignmentId);
      } catch (err) {
        console.error("Error loading assignment submissions", err);
      } finally {
        setLoading(false);
      }
    };
  
    const fetchProjectSubmissionsData = async () => {
      try {
        const res = await getProjectSubmissions(filters.course, filters.semester);
        setSubmissions(res.data.data || []);
      } catch (err) {
        console.error("Error fetching project submissions:", err);
      }
    };
  
    useEffect(() => {
      if (filters.course && filters.semester && selectedType === "assignment") {
        fetchSubjects(filters.course, filters.semester);
      }
    }, [filters.course, filters.semester, selectedType]);
  
    const handleFilterChange = (e) => {
      const { name, value } = e.target;
      setFilters((prev) => ({ ...prev, [name]: value }));
  
      if (name === "course") fetchSemesters(value);
      if (name === "semester") fetchSubjects(value);
    };
  
    const handleCardClick = (type) => {
      setSelectedType(type);
      setFilters({ course: "", semester: "", subject: "" });
      setSubmissions([]);
      setSelectedAssignmentId(null);
      setAssignments([]);
    };
  
    const isFilterReady =
      selectedType === "assignment"
        ? filters.course && filters.semester && filters.subject
        : filters.course && filters.semester;
  
    if (loading) return <InlineLoader />;
  
    return (
      <Box sx={{ mt: 4 }}>
        {!selectedType ? (
          <Grid2 container spacing={3} justifyContent="center">
            <Grid2 item xs={12} sm={6} md={4}>
              <Card>
                <CardActionArea onClick={() => handleCardClick("assignment")}>
                  <CardContent>
                    <Typography variant="h5" color="primary">
                      View Assignment Submissions
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid2>
            <Grid2 item xs={12} sm={6} md={4}>
              <Card>
                <CardActionArea onClick={() => handleCardClick("project")}>
                  <CardContent>
                    <Typography variant="h5" color="primary">
                      View Project Submissions
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid2>
          </Grid2>
        ) : (
          <Box>
            <Button
              variant="outlined"
              onClick={() => handleCardClick(null)}
              sx={{ mb: 2 }}
            >
              ← Back to Selection
            </Button>
  
            <Typography variant="h6" gutterBottom>
              {selectedType === "assignment"
                ? selectedAssignmentId
                  ? "Student Submissions"
                  : "Your Assignments"
                : "Project Submissions"}
            </Typography>
  
            {/* Filters */}
            <div className="flex gap-4 mb-4">
              <Select
                name="course"
                value={filters.course}
                onChange={handleFilterChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="">All Courses</MenuItem>
                <MenuItem value="bca">BCA</MenuItem>
                <MenuItem value="mca">MCA</MenuItem>
              </Select>
  
              <Select
                name="semester"
                value={filters.semester}
                onChange={handleFilterChange}
                displayEmpty
                fullWidth
              >
                <MenuItem value="">All Semesters</MenuItem>
                {semesters.map((sem) => (
                  <MenuItem key={sem} value={sem}>
                    Semester {sem}
                  </MenuItem>
                ))}
              </Select>
  
              {selectedType === "assignment" && (
                <Select
                  name="subject"
                  value={filters.subject}
                  onChange={handleFilterChange}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="">All Subjects</MenuItem>
                  {subjects.map((sub) => (
                    <MenuItem key={sub._id} value={sub._id}>
                      {sub.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </div>
  
            {isFilterReady && selectedType === "assignment" && !selectedAssignmentId && (
              <Button variant="contained" onClick={fetchAssignments} sx={{ mb: 2 }}>
                Load Assignments
              </Button>
            )}
  
            {isFilterReady && selectedType === "project" && (
              <Button
                variant="contained"
                onClick={fetchProjectSubmissionsData}
                sx={{ mb: 2 }}
              >
                Load Submissions
              </Button>
            )}
  
            {/* Show assignments list */}
            {selectedType === "assignment" && isFilterReady && !selectedAssignmentId && (
              <Paper sx={{ p: 2 }}>
                {assignments.length === 0 ? (
                  <Typography>No assignments found.</Typography>
                ) : (
                  <List>
                    {assignments.map((assignment) => (
                      <ListItem
                        button
                        key={assignment._id}
                        onClick={() => loadSubmissionsForAssignment(assignment._id)}
                      >
                        <ListItemText
                          primary={assignment.title}
                          secondary={`Due: ${new Date(
                            assignment.due_date
                          ).toLocaleDateString()}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Paper>
            )}
  
            {/* Back to assignment list */}
            {selectedType === "assignment" && selectedAssignmentId && (
              <Button
                variant="outlined"
                sx={{ mb: 2 }}
                onClick={() => {
                  setSelectedAssignmentId(null);
                  setSubmissions([]);
                }}
              >
                ← Back to Assignment List
              </Button>
            )}
  
            {/* Submissions List */}
            {(selectedAssignmentId || selectedType === "project") && (
              <Paper sx={{ p: 2 }}>
                {submissions.length === 0 ? (
                  <Typography>No submissions found.</Typography>
                ) : (
                  <List>
                    {submissions.map((sub, i) => (
                      <div key={i}>
                        <ListItem alignItems="flex-start">
                          <ListItemText
                            primary={`Student: ${
                              sub.student?.user.name || "Unknown"
                            } — ${new Date(sub.createdAt).toLocaleString()}`}
                            secondary={
                              <>
                                {selectedType === "assignment" && (
                                  <Typography>
                                    <b>Assignment:</b> {sub.assignment?.title}
                                  </Typography>
                                )}
                                {selectedType === "project" && (
                                  <>
                                    <Typography>
                                      <b>Project:</b> {sub.project_name}
                                    </Typography>
                                    <Typography>
                                      <b>Description:</b> {sub.description}
                                    </Typography>
                                    <Typography>
                                      <b>GitHub:</b>{" "}
                                      <a
                                        href={sub.project_link}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="text-[#4f90d1] hover:underline"
                                      >
                                        {sub.project_link}
                                      </a>
                                    </Typography>
                                  </>
                                )}
                                <Typography sx={{ mt: 1 }}>
                                  <b>Files:</b>{" "}
                                  {(sub.files || [sub.file]).map((file, idx) => (
                                    <a
                                      key={idx}
                                      href={file}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="mr-8 text-[#4f90d1] font-bold hover:underline"
                                    >
                                      View File {idx + 1}
                                    </a>
                                  ))}
                                </Typography>
                              </>
                            }
                          />
                        </ListItem>
                        <Divider />
                      </div>
                    ))}
                  </List>
                )}
              </Paper>
            )}
          </Box>
        )}
      </Box>
    );
  };
  
  export default ViewSubmissions;
  