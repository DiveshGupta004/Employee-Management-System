import React, { useState, useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/validate", {
          credentials: "include",  // Ensure cookies are sent with the request
        });

        const text = await response.text(); // Read response as text first

        // ✅ Handle unexpected HTML responses
        try {
          const data = JSON.parse(text);
          setIsAuthenticated(data.isAuthenticated);
        } catch (error) {
          console.error("Invalid JSON response:", text);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        setIsAuthenticated(false);
      }
    };

    checkAuthentication();
  }, []);

  // Handle while state is null (loading state)
  if (isAuthenticated === null) {
    return <div>Loading...</div>; // Or any other loading component
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
