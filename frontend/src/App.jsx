import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Outlet } from "react-router-dom";
import "./App.css";
import Login from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./routes/protectedRoute";
import Dashboard from "./pages/Dashboard";
import EmployeeTable from "./pages/EmployeeTable";
import LeaveApproval from "./pages/LeaveApproval";
import AttendancePage from "./pages/Attendance"; // ✅ Import AttendancePage
import TopBar from "./components/Topbar";
import Sidebar from "./components/Sidebar";

import NavBar from "./components/CompleteNavbar";
import EmpoloyeeTable from "./pages/EmployeeTable";
import Addfields from './pages/Addfields';
import AuthCheck from "./components/AuthCheck";
import Events from "./pages/Events";
// Layout component that includes NavBar and an Outlet for nested routes
const DashboardLayout = () => {
  return (
    <div>
      <NavBar />
      <Outlet />  
    </div>
  );
};

function App() {
  return (
    <Router>
      {/* <AuthCheck/> */}
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes with Dashboard Layout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee-table" element={<EmpoloyeeTable />} />
            <Route path="/addfields" element={<Addfields />} />
            <Route path="/employee-table" element={<EmployeeTable />} />
            <Route path="/leave-approval" element={<LeaveApproval />} />
            <Route path="/attendance" element={<AttendancePage />} /> {/* ✅ Added Attendance Page Route */}
            <Route path="/events" element={<Events />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
