import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import Login from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./routes/protectedRoute";
import Dashboard from "./pages/Dashboard";
import EmployeeTable from "./pages/EmployeeTable";
import TopBar from "./components/TopBar";
import Sidebar from "./components/Sidebar";

// Layout component that includes TopBar, Sidebar, and nested routes
import NavBar from "./components/CompleteNavbar";
import EmpoloyeeTable from "./pages/EmployeeTable";
import Addfields from './pages/Addfields';
// Layout component that includes NavBar and an Outlet for nested routes
const DashboardLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="flex-1">
        <TopBar setIsSidebarOpen={setIsSidebarOpen} />
        <div className="p-4 mt-16">{/* Offset for fixed TopBar */} 
          <Outlet />
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes with Dashboard Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee-table" element={<EmployeeTable />} />
            <Route path="/employee-table" element={<EmpoloyeeTable />} />
            <Route path="/addfields" element={<Addfields />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
