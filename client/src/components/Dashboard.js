import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardHeader from './DashboardHeader';
import authService from '../services/auth';
import './Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('User');

  useEffect(() => {
    // Check if user is logged in
    const token = authService.getToken();
    if (!token) {
      navigate('/');
      return;
    }

    // Get user data if available
    const user = authService.getCurrentUser();
    if (user && user.name) {
      setUsername(user.name);
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <DashboardHeader />

      <h1>Welcome to Your Dashboard, {username}</h1>

      <div className="dashboard-content">
        <div className="dashboard-section">
          <h2>Overview</h2>
          <p>You're successfully logged in! This is your personal dashboard where you can manage your account and access our platform's features.</p>
        </div>

        <div className="dashboard-section">
          <h2>Quick Actions</h2>
          <div className="dashboard-actions-grid">
            <div className="dashboard-action-card">
              <div className="action-icon">📊</div>
              <h3>View Analytics</h3>
              <p>Check your usage statistics</p>
            </div>
            <div className="dashboard-action-card">
              <div className="action-icon">⚙️</div>
              <h3>Settings</h3>
              <p>Manage your account settings</p>
            </div>
            <div className="dashboard-action-card">
              <div className="action-icon">📝</div>
              <h3>Create New</h3>
              <p>Start a new project</p>
            </div>
            <div className="dashboard-action-card">
              <div className="action-icon">🔍</div>
              <h3>Explore</h3>
              <p>Discover new features</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;