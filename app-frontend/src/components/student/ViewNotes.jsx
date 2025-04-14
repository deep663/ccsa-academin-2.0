import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { getNotesBySubject, getSemesterSubjects } from "../../utils/api";
import { useSelector } from "react-redux";

const ViewNotes = () => {
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const user = useSelector((s) => s.user.fields);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getSemesterSubjects(user.course, user.semester);
      setSubjects(response.data.data);
    } catch (err) {
      console.error("Failed to load subjects", err);
    } finally {
      setLoading(false);
    }
  };

  const openNotes = async (subject) => {
    setSelectedSubject(subject);
    setOpenDialog(true);
    try {
      setLoading(true);
      const response = await getNotesBySubject(subject._id);
      setNotes(response.data.data);
    } catch (err) {
      console.error("Failed to load notes", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return (
    <div className="p-6">
      <Typography variant="h5" gutterBottom>
        Your Subjects
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <Grid container spacing={2}>
          {subjects.map((subject) => (
            <Grid item xs={12} sm={6} md={4} key={subject._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{subject.name}</Typography>
                  <Typography variant="body2" color="textSecondary">
                    Teacher: {subject.teacher.user.name}
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => openNotes(subject)}
                    style={{ marginTop: "10px" }}
                  >
                    View Notes
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Notes Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>Notes for {selectedSubject?.name}</DialogTitle>
        <DialogContent>
          {loading ? (
            <CircularProgress />
          ) : notes.length === 0 ? (
            <Typography>No notes available.</Typography>
          ) : (
            <List>
              {notes.map((note, idx) => (
                <ListItem key={idx}>
                  <ListItemText
                    primary={note.title}
                    secondary={new Date(note.createdAt).toLocaleString()}
                  />
                  <div
                    style={{
                      display: "flex",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                      marginTop: "0.5rem",
                    }}
                  >
                    {note.files.map((fileUrl, fileIdx) => (
                      <Button
                        key={fileIdx}
                        variant="contained"
                        size="small"
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View File {fileIdx + 1}
                      </Button>
                    ))}
                  </div>
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewNotes;
