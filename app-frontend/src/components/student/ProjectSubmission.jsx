import { useEffect, useState, Fragment } from "react";
import {
  TextField,
  Button,
  Grid2,
  Typography,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  IconButton,
  Tooltip,
} from "@mui/material";
import { useSelector } from "react-redux";
import InlineLoader from "../InlineLoader";
import {
  deleteProject,
  getStudentProjectSubmissions,
  submitProject,
} from "../../utils/api";
import { FaTrashAlt } from "react-icons/fa";
import { BiRefresh } from "react-icons/bi";

const ProjectSubmission = () => {
  const user = useSelector((state) => state.user.fields);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    project_name: "",
    description: "",
    project_link: "",
    files: [],
  });

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await getStudentProjectSubmissions(user.roleId);
      setProjects(res.data.data);
    } catch (error) {
      console.error("Error fetching student projects", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "files") {
      setFormData({ ...formData, files: Array.from(files) });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const fileForm = new FormData();
      fileForm.append("course", user.course);
      fileForm.append("semester", user.semester);
      fileForm.append("student", user.roleId);
      fileForm.append("project_name", formData.project_name);
      fileForm.append("description", formData.description);
      fileForm.append("project_link", formData.project_link);

      formData.files.forEach((file) => fileForm.append("files", file));

      await submitProject(fileForm);
      alert("Project submitted!");
      setFormData({
        project_name: "",
        description: "",
        project_link: "",
        files: [],
      });
    } catch (error) {
      console.error("Submission error:", error);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this submission?"))
      return;

    try {
      setLoading(true);
      await deleteProject(id);
      alert("Deleted successfully!");
    } catch (error) {
      console.error("Delete failed", error);
      alert("Failed to delete project");
    } finally {
      fetchProjects();
      setLoading(false);
    }
  };

  if (loading) return <InlineLoader />;

  return (
    <>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 700, mx: "auto", mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Submit Project
        </Typography>
        <form onSubmit={handleSubmit}>
          <Grid2 container spacing={2}>
            <Grid2 item xs={12}>
              <TextField
                label="Project Name"
                name="project_name"
                fullWidth
                value={formData.project_name}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Project Link (GitHub)"
                name="project_link"
                fullWidth
                value={formData.project_link}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Description"
                name="description"
                fullWidth
                multiline
                minRows={3}
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 item xs={12}>
              <TextField
                label="Files"
                type="file"
                name="files"
                size="small"
                multiple
                onChange={handleChange}
                required
              />
            </Grid2>
            <Grid2 item xs={12}>
              <Button type="submit" variant="contained" fullWidth>
                Submit Project
              </Button>
            </Grid2>
          </Grid2>
        </form>
      </Paper>

      <Paper elevation={2} sx={{ mt: 4, p: 2 }}>
        <div className="flex justify-between">
          <Typography variant="h6" gutterBottom>
            Your Previous Submissions
          </Typography>
          <Button variant="outlined" size="medium" onClick={()=>fetchProjects()}>
            <BiRefresh className="text-2xl"/>
          </Button>
        </div>
        {projects.length > 0 && (
          <List>
            {projects.map((proj, idx) => (
              <Fragment key={idx}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={proj.project_name}
                    secondary={
                      <>
                        <Typography variant="body2" color="text.secondary">
                          {proj.description}
                        </Typography>
                        <Typography variant="caption" display="block">
                          GitHub:{" "}
                          <a
                            href={proj.project_link}
                            target="_blank"
                            rel="noreferrer"
                          >
                            {proj.project_link}
                          </a>
                        </Typography>
                        <Typography variant="caption" display="block">
                          Submitted on:{" "}
                          {new Date(proj.createdAt).toLocaleString()}
                        </Typography>
                        <Typography variant="caption" display="block">
                          Files:{" "}
                          {proj.files.map((f, i) => (
                            <a
                              key={i}
                              href={f}
                              target="_blank"
                              rel="noreferrer"
                              className="block mr-8 text-blue-600 underline "
                            >
                              View File {i + 1}
                            </a>
                          ))}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                <ListItem
                  alignItems="flex-start"
                  secondaryAction={
                    <Tooltip title="Delete Submission">
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => handleDelete(proj._id)}
                      >
                        <FaTrashAlt className="text-red-600" />
                      </IconButton>
                    </Tooltip>
                  }
                />
                <Divider />
              </Fragment>
            ))}
          </List>
        )}
      </Paper>
    </>
  );
};

export default ProjectSubmission;
