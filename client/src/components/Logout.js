import React from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/auth';
import './Logout.css';

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Call the logout method from the auth service
    authService.logout();
    
    // Redirect to the landing page
    navigate('/');
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      Logout
    </button>
  );
};

export default Logout;
