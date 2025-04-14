import { Link } from "react-router-dom";
import { FaBook, FaFileAlt, FaProjectDiagram, FaFileCode, FaTachometerAlt } from "react-icons/fa";

const StudentSidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-[#192f59] text-white p-5">
      <h2 className="text-xl font-bold mb-5">Student Panel</h2>
      <ul className="space-y-4">
      <li>
          <Link to="/dashboard" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/dashboard/student/notes" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaBook /> Notes
          </Link>
        </li>
        <li>
          <Link to="/dashboard/student/assignments" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaFileCode />Assignments
          </Link>
        </li>
        <li>
          <Link to="/dashboard/student/marks" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaFileAlt /> Marks
          </Link>
        </li>
        <li>
          <Link to="/dashboard/student/projects" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaProjectDiagram /> Project Submission
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default StudentSidebar;
