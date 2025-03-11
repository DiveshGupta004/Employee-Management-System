import { Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/verify-token", {
          method: "GET",
          credentials: "include", // ✅ Ensure cookies are sent
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    // Check token in localStorage as a fallback
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
    } else {
      checkAuth(); // Verify token via API if not in localStorage
    }
  }, []);

  if (isAuthenticated === null) {
    return <div className="text-center mt-20 text-xl">Loading...</div>; // ✅ Prevent blank screen
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
