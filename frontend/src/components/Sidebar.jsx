import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-all duration-300 ease-in-out z-50 ${
        isSidebarOpen ? "w-64" : "w-0"
      } overflow-hidden`}
      onMouseEnter={() => setIsSidebarOpen(true)}
      onMouseLeave={() => setIsSidebarOpen(false)}
    >
      <div className="p-5 flex flex-col h-full mt-20"> {/* Added mt-10 */}
        {/* Navigation Links */}
        <ul className="space-y-4">
          <li>
            <Link
              to="/dashboard"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">📊</span>
              <span
                className={`ml-4 whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
                  isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                Dashboard
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/attendance"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">📅</span>
              <span
                className={`ml-4 whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
                  isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                Attendance
              </span>
            </Link>
          </li>
          <li>
            <Link
              to="/employee-table"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">👨‍💼</span>
              <span
                className={`ml-4 whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
                  isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                Employee Table
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
          <li>
            <Link
              to="/events"
              className="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="text-xl">👨‍💼</span>
              <span
                className={`ml-4 whitespace-nowrap overflow-hidden transition-opacity duration-200 ${
                  isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
                }`}
              >
                Create Event
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
