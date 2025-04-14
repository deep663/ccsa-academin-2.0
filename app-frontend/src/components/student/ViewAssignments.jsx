import {
  List,
  ListItem,
  ListItemText,
  Button,
  Typography,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { getAssignments, getStudentSubmissions, submitAssignment } from "../../utils/api";
import { useSelector } from "react-redux";
import InlineLoader from "../InlineLoader";

const StudentAssignments = () => {
  const user = useSelector((state) => state.user.fields);
  const [assignments, setAssignments] = useState([]);
  const [submissions, setSubmissions] = useState({});
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState([]);

  const fetchAssignments = async () => {
    try {
      const res = await getAssignments(user.course, user.semester);
      setAssignments(res.data.data);
    } catch (err) {
      console.error("Error fetching assignments:", err);
    }
  };

  const fetchSubmissions = async () => {
    try {
      const res = await getStudentSubmissions(user.roleId);
      const submittedMap = {};
      res.data.data.forEach((submission) => {
        submittedMap[submission.assignment._id] = true;
      });
      setSubmissions(submittedMap);
      setResponse(res.data.data);
    } catch (err) {
      console.error("Error fetching submissions:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        await fetchAssignments();
        await fetchSubmissions();
      } catch (err) {
        console.error("Failed to fetch assignments or submissions", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleSubmit = async (assignmentId) => {
    if (!files) return;

    const formData = new FormData();
    formData.append("assignment", assignmentId);
    formData.append("student", user.roleId);

    files.files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      setLoading(true);
      await submitAssignment(formData);
      alert("Assignment submitted!");
      setSubmissions({ ...submissions, [assignmentId]: true });
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const handlePreview = (assignmentId) => {
    const submission = response.find(
      (item) => item.assignment._id === assignmentId
    );
    if (submission && submission.files && submission.files.length > 0) {
      window.open(submission.files[0], "_blank");
    } else {
      alert("No file found for preview.");
    }
  };

  if (loading) return <InlineLoader />;

  return (
    <div className="p-6">
      <Typography variant="h5" gutterBottom>
        Assignments
      </Typography>

      <List>
        {assignments.map((assignment) => (
          <ListItem key={assignment._id} divider>
            <div className="w-full">
              <ListItemText
                primary={assignment.title}
                secondary={
                  <>
                    <Typography variant="body2">
                      {assignment.description}
                    </Typography>
                    <Typography variant="caption">
                      Due: {new Date(assignment.due_date).toLocaleDateString()}
                    </Typography>
                    <br />
                    {assignment.files.map((fileUrl, fileIdx) => (
                      <Button
                        key={fileIdx}
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="outlined"
                        size="small"
                        sx={{ mt: 1 }}
                      >
                        View Assignment File {fileIdx + 1}
                      </Button>
                    ))}
                  </>
                }
              />

              {submissions[assignment._id] ? (
                <div className="flex items-center gap-2 mt-2">
                  <Typography variant="body2" color="green">
                    Submitted
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handlePreview(assignment._id)}
                  >
                    Preview
                  </Button>
                </div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <TextField
                    type="file"
                    size="small"
                    onChange={(e) =>
                      setFiles({ ...files, files: Array.from(e.target.files) })
                    }
                  />
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleSubmit(assignment._id)}
                  >
                    Submit
                  </Button>
                </div>
              )}
            </div>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default StudentAssignments;
