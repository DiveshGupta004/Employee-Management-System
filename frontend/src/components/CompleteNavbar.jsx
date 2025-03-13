import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Update the path as necessary
import TopBar from './TopBar'; // Update the path as necessary

function CompleteNavbar() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);

    const toggleSidebar = () => {
        setSidebarOpen(!isSidebarOpen);
    };

    return (
        <div className="flex">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <div className="flex-1 flex flex-col pl-0 transition-all duration-300">
                <TopBar toggleSidebar={toggleSidebar} />
                <div className="mt-14 p-6">
                    
                </div>
            </div>
        </div>
    );
}

export default CompleteNavbar;
