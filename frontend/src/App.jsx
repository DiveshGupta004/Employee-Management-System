import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";

import Login from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./routes/protectedRoute";
import RoleProtectedRoute from "./routes/RoleProtectedRoute";
import Dashboard from "./pages/Dashboard";
import EmployeeTable from "./pages/EmployeeTable";
import LeaveApproval from "./pages/LeaveApproval";
import EmployeeLeavePage from "./pages/EmployeeLeavePage";
import AttendancePage from "./pages/Attendance";
import Addfields from "./pages/Addfields";
import Events from "./pages/Events";
import ShowEvents from "./pages/ShowEvents";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import { SidebarDemo } from "./components/Navbar";
import AuthCheck from "./components/AuthCheck";
import { Toaster } from "@/components/ui/sonner";
import EmployeAttendance from "./pages/EmployeAttendance";
import LogsPage from "./pages/LogsPage";
const DashboardLayout = () => (
  <>
    <SidebarDemo />
  </>
);

function App() {
  
  return (
    <Router>
      <AuthCheck />
      <Toaster position="top-right" richColors />

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* Admin-only Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleProtectedRoute allowedFor="admin" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/employee-table" element={<EmployeeTable />} />
              <Route path="/addfields" element={<Addfields />} />
              <Route path="/leave-approval" element={<LeaveApproval />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/create-events" element={<Events />} />
              <Route path="/events" element={<ShowEvents />} />
            </Route>
          </Route>
        </Route>

        {/* Employee-only Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<RoleProtectedRoute allowedFor="employee" />}>
            <Route element={<DashboardLayout />}>
              <Route path="/employee/dashboard" element={<EmployeeDashboard />} />
              <Route path="/employee/leave-requests" element={<EmployeeLeavePage />} />
              <Route path="/employee/events" element={<ShowEvents/>} />
              <Route path="/employee/attendance" element={<EmployeAttendance/>} />
              <Route path="/employee/logs" element={<LogsPage/>} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
