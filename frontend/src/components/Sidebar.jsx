import React from 'react';
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
    return (
        <div className={`absolute top-0 left-0 w-64 bg-gray-800 text-white h-full overflow-auto ease-in-out transition-transform duration-300 z-40 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <div className="p-5">
                <button onClick={toggleSidebar} className="text-white text-lg font-semibold hover:text-gray-300">
                    {/* SVG for close icon */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <a href="#" className="text-white text-2xl font-semibold block mt-3">Dashboard</a>
                <ul className="mt-6">
                    <li className="my-px">
                        <Link to="/attendance" className="flex items-center p-4 rounded-lg hover:bg-gray-700 transition-colors">
                            <span className="flex-1 ml-3 whitespace-nowrap">Attendance</span>
                        </Link>
                    </li>
                    <li className="my-px">
                        <Link to="/employee-table" className="flex items-center p-4 rounded-lg hover:bg-gray-700 transition-colors">
                            <span className="flex-1 ml-3 whitespace-nowrap">Employee Table</span>
                        </Link>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Sidebar;
