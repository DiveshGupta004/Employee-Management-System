import React, { useEffect } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom'; // Import useLocation

const AuthCheck = () => {
  const navigate = useNavigate();
  const location = useLocation();  // Get access to the current location

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/auth/validate', {
          withCredentials: true
        });
  
        const { isAuthenticated, isAdmin } = response.data;
  
        if (!isAuthenticated) {
          if (location.pathname !== '/') {
            navigate('/');
          }
        } else {
          if (location.pathname === '/' || location.pathname === '/login') {
            navigate(isAdmin ? '/dashboard' : '/employee/dashboard');
          }
        }
      } catch (error) {
        if (location.pathname !== '/') {
          navigate('/');
        }
      }
    };
  
    validateToken();
  }, [navigate, location.pathname]);
    // Depend on location.pathname to re-run when it changes

  return null; // This component does not render anything
};

export default AuthCheck;
