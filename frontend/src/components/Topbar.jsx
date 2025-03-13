import React, { useState } from 'react';

const TopBar = ({ setIsSidebarOpen }) => {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/logout', {
        method: 'POST',
        credentials: 'include'  // This is crucial to include cookies with the request
      });
  
      if (response.ok) {
        // Redirect to login page or home page
        window.location.href = '/';
      } else {
        throw new Error('Failed to log out.');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Logout failed. Please try again.');
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
