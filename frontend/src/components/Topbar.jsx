import React from 'react';
import Cookies from 'js-cookie'; // Make sure to install this package

const TopBar = ({ toggleSidebar }) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleLogout = () => {
    Cookies.remove('jwt'); // Assuming your JWT token is stored as 'jwt'
    window.location.href = '/'; // Redirect to login page or home page
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg p-4 flex justify-between items-center fixed w-full z-30">
      <button className="text-white focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-lg text-sm p-2" onClick={toggleSidebar}>
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
        </svg>
      </button>
      <div className="text-lg font-semibold">Admin Dashboard</div>
      <div className="flex items-center">
        <div className="mx-3">{currentDate}</div>
        <button onClick={handleLogout} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default TopBar;
