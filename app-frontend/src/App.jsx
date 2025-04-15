import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import LoginPage from "./pages/Login";
import RegisterPage from "./pages/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "./utils/userSlice";
import AuthOutlet from "./components/AuthOutlet";
import ProtectedRoute from "./components/ProtectedRoute";
import TeacherDashboard from "./components/teacher/TeacherDashboard";
import StudentDashboard from "./components/student/StudentDashboard";
import AdminDashboard from "./components/admin/AdminDashboard";
import ManageUsers from "./components/admin/ManageUsers";
import ManageSubjects from "./components/admin/ManageSubjects";
import ManageNotes from "./components/teacher/ManageNotes";
import ManageAssignments from "./components/teacher/ManageAssignments";
import ManageMarks from "./components/teacher/ManageMarks";
import ProfilePage from "./pages/ProfilePage";
import ViewNotes from "./components/student/ViewNotes";
import StudentAssignments from "./components/student/ViewAssignments";
import StudentMarks from "./components/student/ViewMarks";
import ProjectSubmission from "./components/student/ProjectSubmission";
import ViewSubmissions from "./components/teacher/ViewSubmissions";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((s) => s.user.fields);
  const userRole = user?.role;

  useEffect(() => {
    const User = JSON.parse(localStorage.getItem("user"));
    if (User) {
      dispatch(login(User));
    }
  }, [dispatch]);
  return (
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        <Route element={<AuthOutlet fallbackPath="/login" />}>
          <Route path="/dashboard/*" element={<Dashboard />}>
            <Route
              index
              element={
                userRole === "teacher" ? (
                  <TeacherDashboard />
                ) : userRole === "student" ? (
                  <StudentDashboard />
                ) : userRole === "admin" ? (
                  <AdminDashboard />
                ) : (
                  <Navigate to="/dashboard/" />
                )
              }
            />

            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="admin/manage-users" element={<ManageUsers />} />
              <Route
                path="admin/manage-subjects"
                element={<ManageSubjects />}
              />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["teacher"]} />}>
              <Route
                path="teacher/manage-assignments"
                element={<ManageAssignments />}
              />
              <Route path="teacher/manage-notes" element={<ManageNotes />} />
              <Route path="teacher/manage-marks" element={<ManageMarks />} />
              <Route path="teacher/submissions" element={<ViewSubmissions />} />
            </Route>

            <Route element={<ProtectedRoute allowedRoles={["student"]} />}>
              <Route path="student/notes" element={<ViewNotes />} />
              <Route
                path="student/assignments"
                element={<StudentAssignments />}
              />
              <Route path="student/marks" element={<StudentMarks />} />
              <Route path="student/projects" element={<ProjectSubmission />} />
            </Route>
          </Route>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
