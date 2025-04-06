import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './OAuthCallback.css';

const OAuthCallback = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [status, setStatus] = useState('Processing authentication...');

  useEffect(() => {
    const processOAuthCallback = () => {
      try {
        // Get token from URL query parameters
        const params = new URLSearchParams(location.search);
        const token = params.get('token');
        
        if (!token) {
          setStatus('Authentication failed. No token received.');
          return;
        }
        
        // Store token in localStorage
        localStorage.setItem('token', token);
        
        // Set success message
        setStatus('Authentication successful! Redirecting...');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);
      } catch (error) {
        console.error('OAuth callback error:', error);
        setStatus('Authentication failed. Please try again.');
      }
    };
    
    processOAuthCallback();
  }, [location, navigate]);

  return (
    <div className="oauth-callback-container">
      <div className="oauth-callback-card">
        <div className="oauth-status-icon">
          {status.includes('successful') ? '✓' : status.includes('failed') ? '✗' : '⟳'}
        </div>
        <h2>OAuth Authentication</h2>
        <p className="status-message">{status}</p>
      </div>
    </div>
  );
};

export default OAuthCallback;
