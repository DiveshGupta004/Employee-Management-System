import React from "react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const location = useLocation(); // Get current route

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-500 ease-in-out z-50 flex flex-col justify-between ${
        isSidebarOpen ? "w-64" : "w-0"
      } overflow-hidden`}
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
    >
      {/* Sidebar Content */}
      <div className="p-5 mt-20">
        {/* Navigation Links */}
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                location.pathname === "/dashboard"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <span className="text-xl">📊</span>
              <span
                className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 invisible"
                }`}
              >
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/attendance"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                location.pathname === "/attendance"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <span className="text-xl">📅</span>
              <span
                className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 invisible"
                }`}
              >
                Attendance
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/employee-table"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                location.pathname === "/employee-table"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <span className="text-xl">👨‍💼</span>
              <span
                className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 invisible"
                }`}
              >
                Employee Table
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/leave-approval"
              className={`flex items-center p-3 rounded-lg transition-colors ${
                location.pathname === "/leave-approval"
                  ? "bg-gray-700"
                  : "hover:bg-gray-700"
              }`}
            >
              <span className="text-xl">📝</span> {/* Professional Notepad Icon */}
              <span
                className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
                  isSidebarOpen ? "opacity-100" : "opacity-0 invisible"
                }`}
              >
                Leave Requests
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/addfields"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">👨‍💼</span>
              <span
                className={`ml-4 whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
                  isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                Add Fields
              </span>
            </Link>
          </li>
        </ul>
      </div>

      {/* Settings Section - Placed at the Bottom */}
      <div className="p-5 border-t border-gray-600">
        <Link
          to="/settings"
          className={`flex items-center p-3 rounded-lg transition-colors ${
            location.pathname === "/settings" ? "bg-gray-700" : "hover:bg-gray-700"
          }`}
        >
          <span className="text-xl">⚙️</span>
          <span
            className={`ml-4 whitespace-nowrap transition-opacity duration-200 ${
              isSidebarOpen ? "opacity-100" : "opacity-0 invisible"
            }`}
          >
            Settings
          </span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
