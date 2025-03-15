import React, { useState } from 'react';
import Sidebar from './Sidebar';  // Import the Sidebar component
import TopBar from './TopBar';    // Import the TopBar component
import { Outlet } from 'react-router-dom';  // Import Outlet if using React Router

const CompleteNavbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1">
        <TopBar setIsSidebarOpen={setIsSidebarOpen} />
        <div className="p-4 mt-16">{/* Offset for fixed TopBar */}
          <Outlet />  {/* This is where child components/routes will be rendered */}
        </div>
      </div>
    </div>
  );
};

export default CompleteNavbar;  // Export the component
