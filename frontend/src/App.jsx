import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/loginPage";
import ForgotPassword from "./components/forgotPassword";
import ResetPassword from "./components/resetPassword"; // ✅ Import ResetPassword
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> {/* ✅ Correct Route */}
      </Routes>
    </Router>
  );
}

export default App;
