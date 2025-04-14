import { useEffect, useState } from "react";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { register } from "../../utils/api";
import Toaster from "../Toaster";

const AddUsers = ({ onClose }) => {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);


  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Basic validations
    if (!fullName) {
      newErrors.fullName = "Full Name is required.";
    }
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!role) {
      newErrors.role = "Role is required.";
    }

    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const formData = new FormData();
    formData.append("name", fullName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("role", role);
    formData.append("avatar", avatar);

    try {
      setLoading(true);
      const response = await register(formData);
      setToast({ show: true, message: response.data.message, type: "success" });
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.message || "Registration failed",
        type: "error",
      });
    }

    // Clear form after submission
    setFullName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setRole("");
    setAvatar(null);
    setErrors({});
    setLoading(false);
  };

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/80">

      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false })}
        />
      )}

      <div className="w-full max-w-xl p-8 rounded-lg shadow-lg bg-gray-200 relative">
        <button
          onClick={() => onClose()}
          className="text-black absolute top-4 right-4 cursor-pointer"
        >
          <FaTimes />
        </button>
        <h2 className="text-black text-2xl font-bold text-center mb-6">
          Add Users
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Avatar Upload - First Input Field */}
            <div className="mb-4">
              <label className="block text-black">Upload Profile Picture</label>
              <input
                type="file"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
              />
            </div>

            {/* Full Name */}
            <div className="mb-4">
              <label className="block text-black">Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                placeholder="Enter your full name"
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm">{errors.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-4">
              <label className="block text-black">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                placeholder="Enter your email"
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="mb-4">
              <label className="block text-black">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                  placeholder="Enter a password"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-2 top-3 text-gray-500"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div className="mb-4">
              <label className="block text-black">Confirm Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                  placeholder="Confirm your password"
                />
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowPassword(!showPassword);
                  }}
                  className="absolute right-2 top-3 text-gray-500"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Role Selection */}
            <div className="mb-4">
              <label className="block text-black">Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
              >
                <option value="" disabled>
                  Select Role
                </option>
                <option value="teacher">Teacher</option>
                <option value="student">Student</option>
              </select>
              {errors.role && (
                <p className="text-red-500 text-sm">{errors.role}</p>
              )}
            </div>
          </div>
          {/* Register Button */}
          <button disabled={loading} className="w-full bg-[#30834d] text-whaite p-2 rounded hover:bg-green-700">
            {loading ? "Loading..." : "Add"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddUsers;
