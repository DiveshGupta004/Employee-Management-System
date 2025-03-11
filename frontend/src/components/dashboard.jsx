import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import Sidebar from "./dashboard/sidebar";
import TopBar from "./dashboard/topbar";
import DashboardWidgets from "./dashboard/dashboardWidgets";
import Charts from "./dashboard/charts";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Ensure state prevents rendering
  const navigate = useNavigate(); 


  const toggleTheme = () => {
      setIsDarkMode(!isDarkMode);
      document.documentElement.classList.toggle("dark");
  };

  // ✅ Prevent rendering until authentication check is complete
  if (loading) {
      return <p>Loading...</p>;
  }

  return (
      <div className="flex">
          <Sidebar toggleTheme={toggleTheme} isDarkMode={isDarkMode} />
          <div className="flex-1 p-6 bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
              <TopBar />
              <DashboardWidgets />
              <Charts />
          </div>
      </div>
  );
};

export default Dashboard;
