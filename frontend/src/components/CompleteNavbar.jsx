import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Update the path as necessary
import TopBar from './Topbar'; // Update the path as necessary

function CompleteNavbar() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1">
        <TopBar setIsSidebarOpen={setSidebarOpen} />
        <div className="p-4 mt-16">
         
        </div>
      </div>
    </div>
  );
};

export default CompleteNavbar;  // Export the component
