import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // make sure you have react-router-dom installed

const AuthCheck = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        // Axios call to backend to validate the token
        const response = await axios.get('http://localhost:5000/api/auth/validate', {
          withCredentials: true  // to send httpOnly cookies to backend
        });
        if (response.data.isAuthenticated) {
          navigate('/dashboard');  // Redirect to main page if the token is valid
        } else {
          navigate('/');  // Redirect to login page if the token is not valid
        }
      } catch (error) {
        navigate('/');  // Redirect to login page on error
      }
    };

    validateToken();
  }, [navigate]);

  return null; // This component does not render anything
};

export default AuthCheck;
