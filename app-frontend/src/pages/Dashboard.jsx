import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import StudentSidebar from "../components/student/StudentSidebar";
import TeacherSidebar from "../components/teacher/TeacherSidebar";
import AdminSidebar from "../components/admin/AdminSidebar";

const Dashboard = () => {
  const user = useSelector((s) => s.user.fields);
  const userType = user?.role;

  return (
    <div className="flex">
      {/* Sidebar */}
      {userType === "student" && <StudentSidebar />}
      {userType === "teacher" && <TeacherSidebar />}
      {userType === "admin" && <AdminSidebar />}

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-0 xl:px-6">
        {/* Nested Routes will be rendered here */}
        <Outlet />
      </div>
    </div>
  );
};

export default Dashboard;
