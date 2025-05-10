import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
  getNotesCount,
  getRecentSubmissions,
  getTeacher,
  getTodaySubmissions,
} from "../../utils/api";
import { add } from "../../utils/userSlice";
import {
  Avatar,
  Box,
  Divider,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { FaRegBell } from "react-icons/fa";

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentSubmissionCount, setRecentSubmissionCount] = useState(0);
  const [todaySubmissionCount, setTodaySubmissionCount] = useState(0);
  const [totalUploadedNotes, setTotalUploadedNotes] = useState(0);

  const fetchCounts = async () => {
    if (!teacher) {
      return;
    }

    try {
      const todayResponse = await getTodaySubmissions(teacher?._id);
      const recentResponse = await getRecentSubmissions(teacher?._id);
      const notesCount = await getNotesCount(teacher?._id);
      // console.log(
      //   todayResponse?.data.data,
      //   recentResponse?.data.data,
      //   notesCount?.data.data
      // );

      setTodaySubmissionCount(todayResponse?.data.data);
      setRecentSubmissionCount(recentResponse?.data.data);
      setTotalUploadedNotes(notesCount?.data.data);
    } catch (err) {
      console.error("Error fetching today's submissions:", err);
    }
  };

  useEffect(() => {
    const fetchTeacher = async () => {
      try {
        const response = await getTeacher();
        const data = response.data.data[0];
        dispatch(add({ roleId: data._id }));
        setTeacher(data);
      } catch (err) {
        console.error("Error fetching teacher:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTeacher();
  }, [dispatch]);

  useEffect(() => {
    if (teacher?._id) {
      fetchCounts();
    }
  }, [teacher]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <CircularProgress />
      </div>
    );
  }

  const notifications = [
    `${todaySubmissionCount} students submitted assignments today`,
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Teacher Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Info */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar sx={{ width: 80, height: 80, fontSize: 36 }}>
                  {teacher?.user?.avatar ? (
                    <img
                      src={teacher?.user?.avatar}
                      alt="avatar"
                      style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    teacher?.user?.name?.charAt(0)
                  )}
                </Avatar>
              </Grid>
              <Grid item>
                <Typography variant="h6">{teacher?.user?.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {teacher?.user?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Role: Teacher
                </Typography>
              </Grid>
            </Grid>

            {/* Expertise */}
            {teacher?.expertise && (
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight="bold">
                  Expertise
                </Typography>
                <Typography variant="body2">{teacher.expertise}</Typography>
              </Box>
            )}

            {/* Educational Qualifications */}
            {teacher?.educational_qualifications?.length > 0 && (
              <Box mt={3}>
                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                  Educational Qualifications
                </Typography>
                {teacher.educational_qualifications.map((qual, index) => (
                  <Box key={index} mb={1}>
                    <Typography variant="body2">
                      <strong>{qual.degree}</strong> - {qual.institution}
                    </Typography>
                  </Box>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>

        {/* Notifications */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" mb={2}>
              <FaRegBell className="mr-1 text-2xl" />
              <Typography variant="h6">Notifications</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <List>
              {(todaySubmissionCount === 0 && (
                <ListItem disablePadding>
                  <ListItemText primary="No notifications" />
                </ListItem>
              )) ||
                notifications.map((note, idx) => (
                  <ListItem key={idx} disablePadding>
                    <ListItemText primary={`• ${note}`} />
                  </ListItem>
                ))}
            </List>
          </Paper>
        </Grid>

        {/* Stats Cards */}
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, bgcolor: "#4f90d1", color: "white" }}
          >
            <Typography variant="h6">Total Uploaded Notes</Typography>
            <Typography variant="h4">{totalUploadedNotes}</Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={3}
            sx={{ p: 3, bgcolor: "#4f90d1", color: "white" }}
          >
            <Typography variant="h6">Recent Student Submissions</Typography>
            <Typography variant="h4">{recentSubmissionCount}</Typography>
          </Paper>
        </Grid>

        {/* Action Buttons */}
        <Grid item xs={12}>
          <Box display="flex" gap={2}>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("teacher/manage-notes")}
            >
              Upload New Notes
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={() => navigate("teacher/submissions")}
            >
              Review Assignments
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherDashboard;
