import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Toaster from "../components/Toaster";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";
import { register } from "../utils/api";
import OverlayLoading from "../components/OverlayLoading";

const RegisterPage = () => {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [avatar, setAvatar] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (avatar) {
      const objectUrl = URL.createObjectURL(avatar);
      setAvatarUrl(objectUrl);
  
      return () => {
        URL.revokeObjectURL(objectUrl);
      };
    } else {
      setAvatarUrl(null);
    }
  }, [avatar]);
  

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
      const response =  await register(formData);
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
    <div className="relative flex min-h-screen items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/ccsa.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {loading && <OverlayLoading />}
      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false })}
          redirect={(toast.type === "success") ? true : false}
          redirectLink="/login"
          redirectButtonText="Login"
        />
      )}

      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-[#192f59] relative z-10">
        <Link to={"/"} className="text-white absolute top-4 right-4">
          <FaTimes />
        </Link>
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit}>
          {/* Avatar Upload - First Input Field */}
          <div className="mb-4 flex flex-col items-center relative">
            <label className="block text-white mb-1">
              Upload Profile Picture
            </label>
            <div className="w-32 h-32 p-1 rounded-full border-4 border-[#4f90d1] object-cover bg-white relative">
              <input
                type="file"
                onChange={(e) => setAvatar(e.target.files[0])}
                className="absolute w-full h-full opacity-0 cursor-pointer z-50"
              />
              <img
                src={avatar ? avatarUrl : "./avatar.svg"}
                alt="Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
          </div>

          {/* Full Name */}
          <div className="mb-4">
            <label className="block text-white">Full Name</label>
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
            <label className="block text-white">Email</label>
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
            <label className="block text-white">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                placeholder="Enter a password"
              />
              <button
                onClick={(e) =>{e.preventDefault(); setShowPassword(!showPassword)}}
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
            <label className="block text-white">Confirm Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                placeholder="Confirm your password"
              />
              <button
                onClick={(e) =>{e.preventDefault(); setShowPassword(!showPassword)}}
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
            <label className="block text-white">Role</label>
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

          {/* Register Button */}
          <button className="w-full bg-[#30834d] text-white p-2 rounded hover:bg-green-700">
            Register
          </button>
        </form>

        {/* Login Redirect */}
        <div className="mt-4 text-center">
          <Link to="/login" className="text-[#4f90d1] hover:underline">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
