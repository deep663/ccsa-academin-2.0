import { useEffect, useRef, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, NavLink } from "react-router-dom";
import { logout } from "../utils/userSlice";
import { signout } from "../utils/api";
import Toaster from "./Toaster";
import OverlayLoading from "./OverlayLoading";
import { Avatar } from "@mui/material";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userMenuRef = useRef(null);

  const user = useSelector((state) => state.user.fields);

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "" });
  const [loading, setLoading] = useState(false);

  const isLoggedIn = !!user;

  useEffect(() => {
    const handleScroll = () => setIsUserMenuOpen(false);
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

  const handleLogout = useCallback(async () => {
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
      setLoading(false);
      navigate("/");
    }
  }, [dispatch, navigate]);

  return (
    <nav className="bg-[#192f59] text-white border-b border-gray-200 sticky top-0 z-50">
      {loading && <OverlayLoading />}

      <div className="max-w-full flex flex-wrap items-center justify-between mx-auto p-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-3">
          <img src="/uniLogo.png" className="h-16" alt="Logo" />
          <span className="text-2xl font-semibold">CCSA Academics</span>
        </Link>

        {/* Right Side: User Profile or Sign In */}
        <div className="flex items-center md:order-2 space-x-3">
          {isLoggedIn ? (
            <div className="relative" ref={userMenuRef}>
              <button
                type="button"
                className="flex text-sm bg-gray-800 rounded-full focus:ring-4 focus:ring-gray-300"
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
              >
                <Avatar sx={{ width: 40, height: 40, fontSize: 18 }}>
                  {user?.avatar ? (
                    <img src={user.avatar} alt="avatar" />
                  ) : (
                    user?.name?.charAt(0)
                  )}
                </Avatar>
              </button>

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
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-[#30834d] text-white rounded-md hover:bg-green-700"
            >
              Sign In
            </Link>
          )}

          {toast.show && (
            <Toaster
              message={toast.message}
              type={toast.type}
              onClose={() => setToast({ show: false })}
              redirect={toast.type === "success"}
            />
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
