import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getStudent } from "../../utils/api";
import { add } from "../../utils/userSlice";
import { CircularProgress } from "@mui/material";
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
} from "@mui/material";
import { FaRegBell } from "react-icons/fa";
import { blue } from "@mui/material/colors";



const StudentDashboard = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [student, setStudent] = useState(null);


  const notifications = [
    "Assignment for DBMS due on 18th April",
    "Your marks for MCA Sem 1 Internal are uploaded",
    "Project submission deadline extended to 30th April",
  ];

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await getStudent();
        const data = response.data.data[0];
        dispatch(add({ roleId: data._id }));
        dispatch(add({ roll_no: data.roll_no }));
        dispatch(add({ course: data.course }));
        dispatch(add({ semester: data.semester }));
        setStudent(data);
      } catch (err) {
        console.error("Error fetching student:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStudent();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <CircularProgress />
      </div>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Student Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Profile Card */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Grid container spacing={2}>
              <Grid item>
                <Avatar
                  sx={{ width: 80, height: 80, fontSize: 36, }}
                  src={student.user.avatarUrl || ""}
                >
                  {student.user?.name?.charAt(0)}
                </Avatar>
              </Grid>
              <Grid item>
                <Typography variant="h6">{student.user.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Roll No: {student.roll_no}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Course: {student.course?.toUpperCase()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Semester: {student.semester}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Email: {student.user.email}
                </Typography>
              </Grid>
            </Grid>
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
              {notifications.map((note, idx) => (
                <ListItem key={idx} disablePadding>
                  <ListItemText primary={`• ${note}`} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default StudentDashboard;
