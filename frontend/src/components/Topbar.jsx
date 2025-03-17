import React from "react";
import { FiLogOut } from "react-icons/fi"; // Import logout icon

const TopBar = ({ setIsSidebarOpen }) => {
  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent
      });

      if (response.ok) {
        window.location.href = "/"; // Redirect to login or home page
      } else {
        throw new Error("Failed to log out.");
      }
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed. Please try again.");
    }
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg p-4 flex justify-between items-center fixed w-full z-30">
      {/* ✅ Sidebar Toggle Button (Triggers Sidebar on Hover) */}
      <button
        className="text-white focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg text-sm p-2"
        onMouseEnter={() => setIsSidebarOpen(true)}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>

      <div className="text-lg font-semibold">Admin Dashboard</div>

      {/* ✅ Logout Button (Icon + Text) */}
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-medium px-5 py-2 rounded-lg shadow-md transition-all duration-300 ease-in-out transform hover:scale-105"
      >
        <FiLogOut className="w-5 h-5" />
        Logout
      </button>
    </nav>
  );
};

export default TopBar;
