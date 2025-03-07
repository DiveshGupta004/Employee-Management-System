import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/loginPage";
import ForgotPassword from "./components/forgotPassword";
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </Router>
  );
}

export default App;
