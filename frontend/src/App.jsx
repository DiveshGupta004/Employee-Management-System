import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/loginPage";
import ForgotPassword from "./components/forgotPassword";
import ResetPassword from "./components/resetPassword";
import Sidebar from "./components/dashboard/sidebar";
import TopBar from "./components/dashboard/topbar";
import DashboardWidgets from "./components/dashboard/dashboardWidgets";
import EmployeeTable from "./components/dashboard/employeeTable";
import TaskChart from "./components/dashboard/charts";
import ProtectedRoute from "./routes/protectedRoute"; // ✅ Ensure correct path
import "./App.css";

function DashboardLayout() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <div className="p-6 space-y-6">
          <DashboardWidgets />
          <TaskChart />
          <EmployeeTable />
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
