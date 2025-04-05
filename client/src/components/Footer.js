import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>PostReact</h3>
          <p>Democratizing access to advanced AI capabilities</p>
        </div>
        
        <div className="footer-section">
          <h3>Links</h3>
          <ul>
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3>Contact</h3>
          <p>Email: info@postreact.com</p>
          <p>Phone: +1 (123) 456-7890</p>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PostReact. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
