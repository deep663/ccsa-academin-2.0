import{ useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  CircularProgress,
  Box,
} from "@mui/material";
import { useSelector } from "react-redux";
import { getStudentMarks } from "../../utils/api";

const StudentMarks = () => {
  const [marks, setMarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = useSelector((state) => state.user.fields);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const res = await getStudentMarks(user.roleId);
        setMarks(res.data.data);
      } catch (error) {
        console.error("Error fetching marks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarks();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box p={2}>
      <Typography variant="h5" gutterBottom>
        Your Marks
      </Typography>
      <Grid container spacing={2}>
        {marks.map((mark) => (
          <Grid item xs={12} sm={6} md={4} key={mark._id}>
            <Card variant="outlined">
              <CardContent>
                <Typography variant="h6">{mark.subject?.name}</Typography>
                <Typography variant="body2">Exam: {mark.exam_type}</Typography>
                <Typography variant="body2">
                  Marks: {mark.marks} / {mark.total_marks}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  {new Date(mark.createdAt).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default StudentMarks;
