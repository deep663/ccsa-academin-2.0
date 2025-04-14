import { useState } from "react";
import { Link } from "react-router-dom";
import Toaster from "../components/Toaster";
import { FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { login } from "../utils/userSlice";
import OverlayLoading from "../components/OverlayLoading";
import { signin } from "../utils/api";

const LoginPage = () => {
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Basic validations
    if (!email) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Email is invalid.";
    }
    if (!password) {
      newErrors.password = "Password is required.";
    }

    // If there are errors, set them and return
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      const response = await signin(email, password);
      // console.log(response)
      localStorage.setItem("user", JSON.stringify(response.data.data));
      dispatch(login(response.data.data));
      setToast({ show: true, message: "Login successful!", type: "success",  });
    } catch (error) {
      setToast({
        show: true,
        message: error.response?.data?.message || "Login failed",
        type: "error",
      });
    }

    // Clear form after submission (optional)
    setEmail("");
    setPassword("");
    setErrors({});
    setLoading(false);


  };

 
  return (
    <div className="relative flex min-h-screen items-center justify-center">
      {/* Background Image with Blur Effect */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{ backgroundImage: "url('/ccsa.png')" }}
      >
        <div className="absolute inset-0 bg-black opacity-40" />
        <div className="absolute inset-0 backdrop-blur-sm" />
      </div>

      {loading && <OverlayLoading/>}

      {toast.show && (
        <Toaster
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ show: false })}
          redirect={(toast.type === "success") ? true : false}
          redirectLink={"/dashboard"}
          redirectButtonText={"Dashboard"}
        />
      )}

      <div className="w-full max-w-md p-8 rounded-lg shadow-lg bg-[#192f59] relative z-10">
        <Link to={"/"} className="text-white absolute top-4 right-4">
          <FaTimes />
        </Link>
        <h2 className="text-white text-2xl font-bold text-center mb-6">
          Login
        </h2>

        <form onSubmit={handleSubmit}>
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

          <div className="mb-4">
            <label className="block text-white">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded bg-white text-black"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password}</p>
            )}
          </div>

          <button className="w-full bg-[#30834d] text-white p-2 rounded hover:bg-green-700">
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <Link to="/register" className="text-[#4f90d1] hover:underline">
            Don&apos;t have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
