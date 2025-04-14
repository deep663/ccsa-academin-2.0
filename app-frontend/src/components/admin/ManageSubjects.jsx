import { useEffect, useState } from "react";
import {
  createSubject,
  deleteSubject,
  getSubjects,
  getTeachers,
  updateSubject,
} from "../../utils/api";
import { GrRefresh } from "react-icons/gr";
import InlineLoader from "../InlineLoader";
import Toaster from "../Toaster";

const ManageSubjects = () => {
  let sems = 8;
  const [subjects, setSubjects] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    type: "theory",
    semester: 1,
    teacher: "",
    course: "",
  });

  const [editingSubjectId, setEditingSubjectId] = useState(null);

  useEffect(() => {
    fetchSubjects();
    fetchTeachers();
  }, []);

  const fetchSubjects = async () => {
    try {
      setLoading(true);
      const response = await getSubjects();
      // console.log(response.data.data);
      setSubjects(response.data.data);
    } catch (err) {
      console.error("Error fetching subjects:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const response = await getTeachers();
      // console.log(response.data.data)
      setTeachers(response.data.data);
    } catch (err) {
      console.error("Error fetching teachers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true)
      if (editingSubjectId) {
        await updateSubject(editingSubjectId, formData);
      } else {
        await createSubject(formData);
      }
      setFormData({
        name: "",
        code: "",
        type: "theory",
        semester: 1,
        teacher: "",
      });
      setToast({ show: true, message: "Subject added successfully", type: "success" });
      setEditingSubjectId(null);
      fetchSubjects();
    } catch (err) {
      console.error("Error saving subject:", err);
      setToast({
        show: true,
        message: "Failed to add the subject.",
        type: "error",
      });
    }finally{
      setLoading(false)
    }
  };

  const handleEdit = (subject) => {
    setFormData({
      name: subject.name,
      code: subject.code,
      type: subject.type,
      semester: subject.semester,
      teacher: subject.teacher,
    });
    setEditingSubjectId(subject._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this subject?")) {
      try {
        setLoading(true);
        await deleteSubject(id);
        fetchSubjects();
      } catch (err) {
        console.error("Error deleting subject:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <InlineLoader />;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Manage Subjects</h1>

      {/* Subject Form */}
      <form
        onSubmit={handleSubmit}
        className="mb-6 bg-gray-100 p-4 rounded shadow-md"
      >
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="name"
            placeholder="Subject Name"
            value={formData.name}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <input
            type="text"
            name="code"
            placeholder="Subject Code"
            value={formData.code}
            onChange={handleInputChange}
            className="p-2 border rounded"
            required
          />
          <select
            name="type"
            value={formData.type}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="theory">Theory</option>
            <option value="practical">Practical</option>
          </select>
          <select
            name="course"
            value={formData.type}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Select Course</option>
            <option value="bca">BCA</option>
            <option value="mca">MCA</option>
          </select>
          <select
            name="semester"
            value={formData.semester}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            {[...Array(sems).keys()].map((n) => (
              <option key={n + 1} value={n + 1}>
                Semester {n + 1}
              </option>
            ))}
          </select>
          <select
            name="teacher"
            value={formData.teacher}
            onChange={handleInputChange}
            className="p-2 border rounded"
          >
            <option value="">Select Teachers</option>
            {teachers?.map((teacher, idx) => (
              <option key={idx} value={teacher?._id}>
                {teacher?.user?.name}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="mt-4 p-2 bg-blue-500 text-white rounded"
        >
          {editingSubjectId ? "Update Subject" : "Add Subject"}
        </button>
      </form>

      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false })}
        />
      )}

      <div className="my-4 w-full flex items-center ">
        <button
          onClick={() => fetchSubjects()}
          className="px-2 py-1 cursor-pointer rounded border-2 border-gray-400"
        >
          <GrRefresh className="w-6 h-6" />
        </button>
      </div>
      {/* Subjects List */}
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">Name</th>
            <th className="border p-2">Code</th>
            <th className="border p-2">Type</th>
            <th className="border p-2">Semester</th>
            <th className="border p-2">Teachers</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {subjects?.map((subject, idx) => (
            <tr key={idx} className="text-center border">
              <td className="border p-2">{subject?.name}</td>
              <td className="border p-2">{subject?.code}</td>
              <td className="border p-2">{subject?.type}</td>
              <td className="border p-2">{subject?.semester}</td>
              <td className="border p-2">
                {subject?.teacher_name}
              </td>
              <td className="border p-2">
                <button
                  onClick={() => handleEdit(subject)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(subject._id)}
                  className="px-2 py-1 bg-red-500 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageSubjects;
