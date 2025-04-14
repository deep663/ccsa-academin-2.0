import { useEffect, useState } from "react";
import { editProfile, getProfile } from "../utils/api";
import InlineLoader from "../components/InlineLoader";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { FaArrowLeft } from "react-icons/fa";

const ProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [semester, setSemester] = useState([]);
  const [profilePic, setProfilePic] = useState(null);

  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const response = await getProfile();
      setProfile(response.data.data);
      setForm(response.data.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSemesters = async (course) => {
    setSemester([]);
    if (!course) return;
    if (course === "bca") {
      setSemester([1, 2, 3, 4, 5, 6, 7, 8]);
    } else if (course === "mca") {
      setSemester([1, 2, 3, 4]);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === "course") fetchSemesters(value);
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      const formData = new FormData();

      for (const key in form) {
        if (form[key] !== undefined && form[key] !== null) {
          formData.append(key, form[key]);
        }
      }

      if (profilePic) {
        formData.append("avatar", profilePic);
      }

      await editProfile(formData);
      setEditing(false);
      fetchProfile();
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) return <InlineLoader />;
  if (!profile)
    return <div className="p-4 text-red-600">Profile not found</div>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-xl">
      <div className="absolute left-10">
        <Button
          variant="outlined"
          startIcon={<FaArrowLeft />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>
      </div>

      <h2 className="text-2xl font-bold mb-4">My Profile</h2>
      <div className="space-y-4">
        {editing && (
          <div>
            <label className="block font-medium">Profile Picture</label>
            <input
              type="file"
              className="w-full border px-3 py-2 rounded-md bg-white"
              onChange={(e) => setProfilePic(e.target.files[0])}
              disabled={!editing}
            />
          </div>
        )}
        <div className="mt-2">
          <img
            src={ profilePic ? URL.createObjectURL(profilePic) : profile.avatar}
            alt={profile.name}
            className="h-20 w-20 object-cover rounded-full border"
          />
        </div>

        <div>
          <label className="block font-medium">Name</label>
          <input
            className="w-full border px-3 py-2 rounded-md"
            name="name"
            value={form.name || ""}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        <div>
          <label className="block font-medium">Email</label>
          <input
            name="email"
            className="w-full border px-3 py-2 rounded-md bg-gray-100"
            value={form.email || ""}
            disabled
          />
        </div>

        <div>
          <label className="block font-medium">Phone</label>
          <input
            className="w-full border px-3 py-2 rounded-md"
            name="phone"
            value={form.phone || ""}
            onChange={handleChange}
            disabled={!editing}
          />
        </div>

        {profile.role === "student" && (
          <>
            <div>
              <label className="block font-medium">Roll No</label>
              <input
                className="w-full border px-3 py-2 rounded-md"
                name="roll_no"
                value={form.roll_no || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <label className="block font-medium">Registration No</label>
              <input
                className="w-full border px-3 py-2 rounded-md"
                name="reg_no"
                value={form.reg_no || ""}
                onChange={handleChange}
                disabled={!editing}
              />
            </div>

            <div>
              <label className="block font-medium">Course</label>
              <select
                className="w-full border px-3 py-2 rounded-md"
                name="course"
                value={form.course || ""}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="">Select</option>
                <option value="bca">BCA</option>
                <option value="mca">MCA</option>
              </select>
            </div>

            <div>
              <label className="block font-medium">Semester</label>
              <select
                type="number"
                className="w-full border px-3 py-2 rounded-md"
                name="semester"
                value={form.semester || ""}
                onChange={handleChange}
                disabled={!editing}
              >
                <option value="">Select</option>
                {semester.map((sem) => (
                  <option key={sem} value={sem}>
                    Semester {sem}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-medium">Enrollment Year</label>
              <input
                type="number"
                className="w-full border px-3 py-2 rounded-md"
                name="enrollment_year"
                value={form.enrollment_year || ""}
                onChange={handleChange}
                disabled={!editing}
                min="1980"
                max={new Date().getFullYear()}
              />
            </div>
          </>
        )}

        {profile.role === "teacher" && (
          <div>
            <label className="block font-medium">Teacher Code</label>
            <input
              className="w-full border px-3 py-2 rounded-md"
              name="teacher_code"
              value={form.teacher_code || ""}
              onChange={handleChange}
              disabled={!editing}
            />
          </div>
        )}

        <div className="flex gap-4 mt-4">
          {!editing ? (
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={() => setEditing(true)}
            >
              Edit Profile
            </button>
          ) : (
            <>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-md"
                onClick={handleUpdate}
              >
                Save Changes
              </button>
              <button
                className="bg-gray-400 text-white px-4 py-2 rounded-md"
                onClick={() => {
                  setEditing(false);
                  setForm(profile); // reset form
                }}
              >
                Cancel
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
