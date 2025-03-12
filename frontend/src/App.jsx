import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Login from "./components/loginPage";
import ForgotPassword from "./components/forgotPassword";
import ResetPassword from "./components/resetPassword";
import Sidebar from "./components/dashboard/sidebar";
import TopBar from "./components/dashboard/topbar";
import ProtectedRoute from "./routes/protectedRoute";
import "./App.css";

function DashboardLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar isOpen={isSidebarOpen} />
      <div className={`flex-1 flex flex-col transition-all duration-300 ${isSidebarOpen ? "ml-64" : "ml-0"}`}>
        <TopBar toggleSidebar={toggleSidebar} />
        <div className="p-6">
          {/* Main dashboard content goes here */}
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        {/* ✅ Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />

        {/* ✅ Protected Admin Dashboard (Requires Authentication) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
