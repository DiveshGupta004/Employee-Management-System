import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEye, FaEyeSlash, FaLock } from "react-icons/fa";
import loginImage from "../assets/admin_login_image.jpg";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
  
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Ensure cookies are sent with the request
      });
  
      const data = await response.json();
  
      // Simulate a delay of 2 seconds before processing login
      setTimeout(() => {
        setLoading(false);
  
        if (response.ok) {
          localStorage.setItem("token", data.token);
          navigate("/dashboard"); // ✅ Redirect after login
        } else {
          setError(data.error || "Invalid credentials!");
        }
      }, 1000); // ⏳ Delay of 2 seconds
    } catch (error) {
      console.error("Login error:", error);
      setError("Something went wrong. Try again!");
      setLoading(false);
    }
  };
  

  const handleLogout = async () => {
    const confirmLogout = window.confirm("Are you sure you want to logout?");
    if (!confirmLogout) return;

    try {
      await fetch("http://localhost:5000/api/auth/logout", {
        method: "POST",
        credentials: "include", // Ensure cookies are sent with the request
      });

      navigate("/"); // Redirect to login page after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
        {/* Left Side - Image */}
        <div className="w-1/2 p-8 hidden md:flex items-center justify-center">
          <img
            src={loginImage}
            alt="Admin login illustration"
            width="400"
            height="400"
          />
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-bold mb-6">Admin Login</h2>

          {/* Show error message */}
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <form onSubmit={handleLogin}>
            {/* Username Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <FaUser className="absolute left-3 top-3 text-gray-400" />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full px-4 py-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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

            {/* Forgot Password Link */}
            <div className="mb-4 text-right">
              <Link to="/forgot-password" className="text-blue-500 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Login Button */}
            <div className="mb-4">
              <button
                type="submit"
                className={`w-full py-2 rounded-lg ${
                  loading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600 text-white"
                }`}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
