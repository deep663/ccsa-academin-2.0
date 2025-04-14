import { Link } from "react-router-dom";
import { FaBook, FaUpload, FaClipboardList, FaUsers, FaTachometerAlt } from "react-icons/fa";

const TeacherSidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-[#192f59] text-white p-5">
      <h2 className="text-xl font-bold mb-5">Teacher Panel</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard/" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaTachometerAlt /> Dashboard
          </Link>
        </li> 
        <li>
          <Link to="/dashboard/teacher/manage-notes" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaBook /> Manage Notes
          </Link>
        </li>
        <li>
          <Link to="/dashboard/teacher/manage-assignments" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaUpload /> Manage Assignments
          </Link>
        </li>
        <li>
          <Link to="/dashboard/teacher/manage-marks" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaClipboardList /> Manage Marks
          </Link>
        </li>
        <li>
          <Link to="/dashboard/teacher/submissions" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaUsers /> View Student Submissions
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default TeacherSidebar;
