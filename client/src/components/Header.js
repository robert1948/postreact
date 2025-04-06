import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const token = localStorage.getItem('token');

  return (
    <header className="header">
      <div className="logo">
        <Link to="/">CapeControl</Link>
      </div>
      <nav className="nav">
        <ul>
          <li><a href="#features">Features</a></li>
          <li><a href="#about">About</a></li>
          <li><a href="#contact">Contact</a></li>
          {token ? (
            <li className="nav-button">
              <Link to="/dashboard" className="btn-primary">Dashboard</Link>
            </li>
          ) : (
            <li className="nav-button">
              <Link to="/login" className="btn-primary">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
