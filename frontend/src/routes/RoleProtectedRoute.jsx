// src/routes/RoleProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const RoleProtectedRoute = ({ allowedFor }) => {
  const [roleInfo, setRoleInfo] = useState({ isAuthenticated: null, isAdmin: null });

  useEffect(() => {
    const checkRole = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/validate", {
          credentials: "include"
        });

        const text = await response.text();
        const data = JSON.parse(text);

        setRoleInfo({
          isAuthenticated: data.isAuthenticated,
          isAdmin: data.isAdmin,
        });
      } catch (error) {
        console.error("Role check failed:", error);
        setRoleInfo({ isAuthenticated: false, isAdmin: null });
      }
    };

    checkRole();
  }, []);

  if (roleInfo.isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  const isAllowed =
    (allowedFor === "admin" && roleInfo.isAdmin) ||
    (allowedFor === "employee" && !roleInfo.isAdmin);

  return roleInfo.isAuthenticated && isAllowed ? (
    <Outlet />
  ) : (
    <Navigate to="/" replace />
  );
};

export default RoleProtectedRoute;
