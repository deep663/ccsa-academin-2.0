import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { logout } from "../utils/userSlice";
import { signout } from "../utils/api";
import Toaster from "./Toaster";
import OverlayLoading from "./OverlayLoading";
import { Avatar } from "@mui/material";

const Navbar = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.fields);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsUserMenuOpen(false);
      }
    };

    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (user === null) {
      setIsLoggedIn(false);
    } else {
      setIsLoggedIn(true);
    }
  }, [user]);

  const handleLogout = async () => {
    setLoading(true);
    dispatch(logout());
    localStorage.clear();
    try {
      await signout();
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setToast({ show: true, message: "Logging Out!", type: "warning" });
      setIsUserMenuOpen(false);
      setIsLoggedIn(false);
      setLoading(false);
      navigate("/");
    }
  };

  return (
    <nav className="bg-[#192f59] text-white border-b border-gray-200 sticky top-0 z-50">
      {loading && <OverlayLoading />}

      <div className="max-w-full flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <a href="/" className="flex items-center space-x-3">
          <img src="/uniLogo.png" className="h-16" alt="Logo" />
          <span className="text-2xl font-semibold">CCSA Academics</span>
        </a>

        {/* Right Side: User Profile or Sign In/Sign Up */}
        <div className="flex items-center md:order-2 space-x-3">
          {isLoggedIn ? (
            // User Logged In: Show Profile & Dropdown Menu
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              >
                <Avatar key={user?.avatar} sx={{ width: 40, height: 40, fontSize: 18 }}>
                  {user?.avatar ? (
                    <img src={user?.avatar} />
                  ) : (
                    user?.name?.charAt(0)
                  )}
                </Avatar>
              </button>

              {/* Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
                  <div className="px-4 py-3 border-b">
                    <span className="block text-sm font-semibold text-gray-900">
                      {user.name}
                    </span>
                    <span className="block text-sm text-gray-500">
                      {user.email}
                    </span>
                  </div>
                  <ul>
                    <li>
                      <NavLink
                        to="/profile"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Profile
                      </NavLink>
                    </li>
                    <li>
                      <a
                        onClick={() => handleLogout()}
                        className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-100 cursor-pointer"
                      >
                        Sign Out
                      </a>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            // User Not Logged In: Show Sign In / Sign Up Buttons
            <div className="space-x-3">
              <Link
                to="/login"
                className="px-4 py-2 bg-[#30834d] text-white rounded-md hover:bg-green-700"
              >
                Sign In
              </Link>
            </div>
          )}

          {toast.show && (
            <Toaster
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ show: false })}
              redirect={toast.type === "success" ? true : false}
            />
          )}

          {/* Mobile Menu Button */}
          {/* <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center p-2 w-10 h-10 justify-center text-white rounded-lg md:hidden hover:bg-[#30834d]"
          >
            <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
              <path stroke="currentColor" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15" />
            </svg>
          </button> */}
        </div>

        {/* Navigation Links */}
        {/* <div className={`${isMenuOpen ? "flex" : "hidden"} w-full md:flex md:w-auto md:order-1`}>
          <ul className="flex flex-col md:flex-row md:space-x-8 font-medium p-4 md:p-0 mt-4 md:mt-0 w-full border border-gray-100 md:border-0 bg-transparent rounded-lg md:rounded-none">
            <li><a href="#" className="block py-2 px-3 text-white bg-[#30834d]  hover:text-white md:text-[#30834d] md:bg-transparent md:hover:text-[#30834d] rounded-lg">Home</a></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:bg-[#30834d] hover:text-white md:hover:bg-transparent md:hover:text-[#30834d] rounded-lg">Dashboard</a></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:bg-[#30834d] hover:text-white md:hover:bg-transparent md:hover:text-[#30834d] rounded-lg">Assignment</a></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:bg-[#30834d] hover:text-white md:hover:bg-transparent md:hover:text-[#30834d] rounded-lg">Notes</a></li>
            <li><a href="#" className="block py-2 px-3 text-white hover:bg-[#30834d] hover:text-white md:hover:bg-transparent md:hover:text-[#30834d] rounded-lg">Contact</a></li>
          </ul>
        </div> */}
      </div>
    </nav>
  );
};

export default Navbar;
