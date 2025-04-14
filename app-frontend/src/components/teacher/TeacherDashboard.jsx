import { useNavigate } from "react-router-dom";
import { getTeacher } from "../../utils/api";
import { useDispatch } from "react-redux";
import { add } from "../../utils/userSlice";
import { useEffect } from "react";

const TeacherDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    fetchTeacher();
  }, []);

  const fetchTeacher = async () => {
    try {
      const response = await getTeacher();
      dispatch(add({roleId: response.data.data[0]._id}));
    } catch (err) {
      console.error("Error fetching teacher:", err);
    }
  };
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Teacher Dashboard</h2>
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-[#4f90d1] p-4 rounded-lg">
          <h3>Total Uploaded Notes</h3>
          <p>50</p>
        </div>
        <div className="bg-[#4f90d1] p-4 rounded-lg">
          <h3>Recent Student Submissions</h3>
          <p>10</p>
        </div>
      </div>
      <div className="bg-[#192f59] text-white p-4 rounded-lg">
        <h3 className="font-bold">Uploaded Notes</h3>
        <table className="min-w-full mt-2">
          <thead>
            <tr>
              <th className="border-b">Title</th>
              <th className="border-b">Date</th>
              <th className="border-b">Downloads</th>
              <th className="border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample Data */}
            <tr>
              <td className="border-b">Math Notes</td>
              <td className="border-b">2023-10-01</td>
              <td className="border-b">20</td>
              <td className="border-b">
                <button className="text-green-500">Edit</button> |
                <button className="text-red-500">Delete</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="mt-4">
        <button onClick={() => navigate("teacher/manage-notes")} className="bg-[#30834d] text-white px-4 py-2 rounded">
          Upload New Notes
        </button>
        <button onClick={() => navigate("teacher/submissions")} className="bg-[#30834d] text-white px-4 py-2 rounded ml-2">
          Review Assignments
        </button>
      </div>
    </div>
  );
};

export default TeacherDashboard;
