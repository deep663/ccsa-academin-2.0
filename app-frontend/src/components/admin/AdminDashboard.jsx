import { useEffect, useState } from "react";
import { Grid, Card, CardContent, Typography } from "@mui/material";
import { getTotalSubjects, usersCounts } from "../../utils/api";

const AdminDashboard = () => {
  const [totaUsers, setTotalUsers] = useState(0);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalTeachers, setTotalTeachers] = useState(0);
  const [unverifiedUsers, setUnverifiedUsers] = useState(0);
  const [totalSubjects, setTotalSubjects] = useState(0);

  const fetchDashboardData = async () => {
    try {
      const userCount = await usersCounts();
      const subjCount = await getTotalSubjects();
      const usersCountdata = userCount.data.data;
      const subjCountdata = subjCount.data.data;

      setTotalUsers(usersCountdata.totalUsers);
      setTotalStudents(usersCountdata.totalStudents);
      setTotalTeachers(usersCountdata.totalTeachers);
      setUnverifiedUsers(usersCountdata.unVerifiedUsers);
      setTotalSubjects(subjCountdata);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const stats = [
    { label: "Total Users", value: totaUsers },
    { label: "Total Students", value: totalStudents },
    { label: "Total Teachers", value: totalTeachers },
    { label: "Pending User Approval", value: unverifiedUsers },
    { label: "Total Subjects", value: totalSubjects },
  ];

  return (
    <div>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Admin Dashboard
      </Typography>
      <Grid container spacing={3}>
        {stats.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card sx={{ backgroundColor: "#4f90d1", color: "#fff" }}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight="bold">
                  {item.label}
                </Typography>
                <Typography variant="h6">{item.value}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default AdminDashboard;
