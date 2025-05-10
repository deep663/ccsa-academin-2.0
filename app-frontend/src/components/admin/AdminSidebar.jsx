import { Link } from "react-router-dom";
import { FaTachometerAlt, FaUserCog, FaBook, FaClipboardList, FaChartBar } from "react-icons/fa";

const AdminSidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-[#192f59] text-white p-5">
      <h2 className="text-xl font-bold mb-5">Admin Panel</h2>
      <ul className="space-y-4">
        <li>
          <Link to="/dashboard" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaTachometerAlt /> Dashboard
          </Link>
        </li>
        <li>
          <Link to="/dashboard/admin/manage-users" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaUserCog /> Manage Users
          </Link>
        </li>
        <li>
          <Link to="/dashboard/admin/manage-subjects" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaBook /> Manage Subjects
          </Link>
        </li>
        {/* <li>
          <Link to="/dashboard/admin/manage-courses" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaClipboardList /> Manage Couses
          </Link>
        </li> */}
        {/* <li>
          <Link to="/dashboard/admin/reports" className="flex items-center gap-3 hover:text-[#30834d]">
            <FaChartBar /> View Reports
          </Link>
        </li> */}
      </ul>
    </div>
  );
};

export default AdminSidebar;
