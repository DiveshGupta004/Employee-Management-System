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
          withCredentials: true  // Ensure cookies are sent with the request
        });
        if (!response.data.isAuthenticated) {
          // Redirect to login only if the user is not authenticated
          // and they are not already on the login page
          if (location.pathname !== '/') {
            navigate('/');
          }
        }
        // If the user is authenticated and trying to access the root (login page), redirect to dashboard
        else if (location.pathname === '/' || location.pathname === '/login') {
          navigate('/dashboard');
        }
        // No redirection if the user is authenticated and not on the login page
      } catch (error) {
        // Redirect to login page on error
        if (location.pathname !== '/') {
          navigate('/');
        }
      }
    };

    validateToken();
  }, [navigate, location.pathname]);  // Depend on location.pathname to re-run when it changes

  return null; // This component does not render anything
};

export default AuthCheck;
