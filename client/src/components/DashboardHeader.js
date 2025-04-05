import React from 'react';
import Logout from './Logout';
import './DashboardHeader.css';

const DashboardHeader = () => {
  return (
    <header className="dashboard-header">
      <div className="dashboard-logo">PostReact</div>
      <nav className="dashboard-nav">
        <ul>
          <li><a href="#dashboard" className="active">Dashboard</a></li>
          <li><a href="#profile">Profile</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>
      </nav>
      <div className="dashboard-actions">
        <Logout />
      </div>
    </header>
  );
};

export default DashboardHeader;
