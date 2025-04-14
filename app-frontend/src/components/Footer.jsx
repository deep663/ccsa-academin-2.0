import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#192f59] text-white shadow-sm border-t-1">
      <div className="w-full max-w-full mx-auto p-6 md:py-8">
        
        {/* Top Section */}
        <div className="sm:flex sm:items-center sm:justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center mb-4 sm:mb-0 space-x-3">
            <img src="/uniLogo.png" className="h-12" alt="CCSA Academic Logo" />
            <span className="text-2xl font-semibold">CCSA Academics</span>
          </a>

          {/* Navigation Links */}
          <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-300 sm:mb-0">
            <li><NavLink to="#" className="hover:underline me-4 md:me-6">About</NavLink></li>
            <li><NavLink to="/dashboard" className="hover:underline me-4 md:me-6">Dashboard</NavLink></li>
            <li><NavLink to="/profile" className="hover:underline me-4 md:me-6">Profile</NavLink></li>
            <li><NavLink to="#" className="hover:underline">Contact</NavLink></li>
          </ul>
        </div>

        {/* Divider */}
        <hr className="my-6 border-gray-600 sm:mx-auto lg:my-8" />

        {/* Bottom Section */}
        <div className="text-center text-sm text-gray-300">
          © {new Date().getFullYear()} <a href="/" className="hover:underline text-[#4f90d1]">CCSA Academics</a>. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
