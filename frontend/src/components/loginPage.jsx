import { useState } from "react";
import { Link } from "react-router-dom";
import { FaUser, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import loginimage from "../assets/admin_login_image.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // ✅ Ensure cookies are sent
      });
  
      const data = await response.json();
      console.log("Response:", response);
      console.log("Data:", data);
  
      if (response.ok) {
        alert("Login successful!");
        window.location.href = "/dashboard";
      } else {
        alert(data.error || "Login failed!");
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Something went wrong. Try again!");
    }
  };
    
  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
        {/* ✅ Left Side - Image */}
        <div className="w-1/2 p-8 hidden md:flex items-center justify-center">
          <img
            src={loginimage}
            alt="Admin login illustration"
            width="400"
            height="400"
          />
        </div>

        {/* ✅ Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6">Login</h2>

          <form onSubmit={handleSubmit}>
            {/* ✅ Username Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
                <FaUser className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* ✅ Password Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FaLock className="absolute left-3 top-3 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* ✅ Forgot Password Link */}
            <div className="mb-4 text-right">
              <Link to="/forgot-password" className="text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* ✅ Login Button */}
            <div className="mb-4">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
