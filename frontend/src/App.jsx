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
import EventCalendar from "./components/EventCalendar";
import { SidebarDemo } from "./components/Navbar";
import EmpoloyeeTable from "./pages/EmployeeTable";
import Addfields from './pages/Addfields';
import AuthCheck from "./components/AuthCheck";
import Events from "./pages/Events";
import ShowEvents from "./pages/ShowEvents";

// ✅ Toaster import
import { Toaster } from "@/components/ui/sonner";

// Layout component that includes Sidebar + nested route content
const DashboardLayout = () => (
  <>
    <SidebarDemo />
    <div className="ml-64 p-4"> {/* Offset for sidebar */}
      <Outlet />
    </div>
  </>
);

function App() {
  return (
    <Router>
      <AuthCheck />
      {/* ✅ Place Toaster here globally */}
      <Toaster position="top-right" richColors />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee-table" element={<EmpoloyeeTable />} />
            <Route path="/addfields" element={<Addfields />} />
            <Route path="/leave-approval" element={<LeaveApproval />} />
            <Route path="/attendance" element={<AttendancePage />} />
            <Route path="/create-events" element={<Events />} />
            <Route path="/events" element={<ShowEvents />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
