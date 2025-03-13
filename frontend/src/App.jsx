import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import "./App.css";
import Login from "./pages/LoginPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./routes/protectedRoute";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/CompleteNavbar";
import EmpoloyeeTable from "./pages/EmployeeTable";

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
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        {/* Wrap the DashboardLayout inside ProtectedRoute if it has specific authentication logic */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/employee-table" element={<EmpoloyeeTable />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
