import React from 'react';
import Header from './Header';
import Login from './Login';
import FeatureSection from './FeatureSection';
import Footer from './Footer';
import './LandingPage.css';

const LandingPage = () => {

  return (
    <div className="landing-page">
      <Header />

      <div className="hero-section">
        <h1>Welcome to CapeControl</h1>
        <p>Democratizing access to advanced AI capabilities</p>
        <div className="hero-buttons">
          <a href="#features" className="btn-primary">Explore Features</a>
          <a href="/register" className="btn-secondary">Register Now</a>
          <a href="/login" className="btn-tertiary">Login</a>
        </div>
      </div>

      <FeatureSection />

      <section id="about" className="about-section">
        <h2>About Our Platform</h2>
        <p className="section-subtitle">Learn how we're changing the game</p>
        <div className="about-content">
          <div className="about-text">
            <p>CapeControl is a cutting-edge platform designed to make advanced AI capabilities accessible to everyone. Our mission is to democratize access to powerful tools that were previously only available to large enterprises.</p>
            <p>With our intuitive interface and powerful backend, you can leverage the latest in AI technology without needing a PhD in machine learning.</p>
          </div>
          <div className="about-image">
            <div className="image-placeholder">Platform Screenshot</div>
          </div>
        </div>
      </section>

      <section id="login" className="login-section">
        <h2>Get Started Today</h2>
        <p className="section-subtitle">Create an account or log in to access our platform</p>
        <Login />
      </section>

      <section id="contact" className="contact-section">
        <h2>Contact Us</h2>
        <p className="section-subtitle">Have questions? We're here to help</p>
        <div className="contact-info">
          <div className="contact-item">
            <div className="contact-icon">📧</div>
            <h3>Email</h3>
            <p>info@cape-control.com</p>
          </div>
          <div className="contact-item">
            <div className="contact-icon">📱</div>
            <h3>Phone</h3>
            <p>+1 (123) 456-7890</p>
          </div>
          <div className="contact-item">
            <div className="contact-icon">🌐</div>
            <h3>Social</h3>
            <div className="social-links">
              <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">Twitter</a>
              <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
              <a href="https://github.com" className="social-link" target="_blank" rel="noopener noreferrer">GitHub</a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
