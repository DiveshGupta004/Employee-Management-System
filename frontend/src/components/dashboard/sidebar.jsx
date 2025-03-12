import React from "react";
import { Link } from "react-router-dom"; // Assuming you are using react-router for navigation

const Sidebar = ({ isOpen }) => {
  return (
    <div
      className={`transform top-0 left-0 w-64 bg-gray-800 text-white fixed h-full overflow-auto ease-in-out transition-all duration-300 z-30 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="p-5">
        <a href="#" className="text-white text-2xl font-semibold">
          Dashboard
        </a>
        <ul className="mt-6">
          <li className="my-px">
            <Link
              to="/attendance"
              className="flex items-center p-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="flex-1 ml-3 whitespace-nowrap">Attendance</span>
            </Link>
          </li>
          <li className="my-px">
            <Link
              to="/employee-table"
              className="flex items-center p-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <span className="flex-1 ml-3 whitespace-nowrap">Employee Table</span>
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
