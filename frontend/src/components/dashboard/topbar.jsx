import React from "react";

const TopBar = ({ toggleSidebar }) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <nav className="bg-gray-800 text-white shadow-lg p-4 flex justify-between items-center">
      {/* Sidebar Toggle Button */}
      <button
        className="text-white focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg text-sm p-2"
        onClick={toggleSidebar}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h16m-7 6h7"
          ></path>
        </svg>
      </button>

      {/* Title - Admin Dashboard */}
      <div className="text-lg font-semibold">Admin Dashboard</div>

      {/* Icons and Date on the Right Side */}
      <div className="flex items-center">
        {/* Notification Icon */}
        <button className="mx-3 p-1 rounded-full hover:bg-gray-700 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 17h5l-1.405-1.405A2 2 0 0119 14V8a7 7 0 00-14 0v6a2 2 0 01-.595 1.595L3 17h5m6 0v1a3 3 0 11-6 0v-1m13-7h-2m4 0h-2m-2 0h-2"
            />
          </svg>
        </button>

        {/* Profile Icon */}
        <img
          className="w-8 h-8 rounded-full mx-3"
          src="https://via.placeholder.com/40x40"
          alt="User Profile"
        />

        {/* Current Date */}
        <div className="text-sm mx-3">
          <time dateTime={new Date().toISOString()}>{currentDate}</time>
        </div>
      </div>
    </nav>
  );
};

export default TopBar;
