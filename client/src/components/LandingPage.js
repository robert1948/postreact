import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiUsers, FiCode, FiLayers } from 'react-icons/fi';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Header from './Header';
import FeatureSection from './FeatureSection';
import Footer from './Footer';
import Login from './Login';
import './LandingPage.css';

const LandingPage = () => {

  return (
    <div className="landing-page">
      <Header />

      <div className="hero-section">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <div className="hero-content">
                <h1 className="fade-in-up">Welcome to <span className="text-gradient">CapeControl</span></h1>
                <p className="fade-in-up delay-1 lead">Democratizing access to advanced AI capabilities</p>
                <div className="hero-buttons fade-in-up delay-2 d-flex flex-wrap gap-2">
                  <Button href="#features" variant="primary" className="btn-pulse">
                    Explore Features <FiArrowRight className="ms-2" />
                  </Button>
                  <Button as={Link} to="/register" variant="secondary">
                    Register Now
                  </Button>
                  <Button as={Link} to="/login" variant="outline-light">
                    Login
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="hero-image fade-in delay-3">
                <div className="hero-image-container">
                  <div className="hero-image-glow"></div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      <FeatureSection />

      <section id="about" className="about-section">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <div className="section-header fade-in">
                <h2 className="text-gradient">About Our Platform</h2>
                <p className="section-subtitle">Learn how we're changing the game</p>
              </div>
            </Col>
          </Row>

          <Row className="align-items-center">
            <Col lg={6} md={12}>
              <div className="about-text fade-in-left">
                <p>CapeControl is a cutting-edge platform designed to make advanced AI capabilities accessible to everyone. Our mission is to democratize access to powerful tools that were previously only available to large enterprises.</p>
                <p>With our intuitive interface and powerful backend, you can leverage the latest in AI technology without needing a PhD in machine learning.</p>

                <Row className="about-stats">
                  <Col md={4} sm={4} xs={12}>
                    <div className="stat-item fade-in-up delay-1">
                      <div className="stat-icon"><FiUsers /></div>
                      <div className="stat-number">10,000+</div>
                      <div className="stat-label">Active Users</div>
                    </div>
                  </Col>
                  <Col md={4} sm={4} xs={12}>
                    <div className="stat-item fade-in-up delay-2">
                      <div className="stat-icon"><FiCode /></div>
                      <div className="stat-number">50+</div>
                      <div className="stat-label">API Endpoints</div>
                    </div>
                  </Col>
                  <Col md={4} sm={4} xs={12}>
                    <div className="stat-item fade-in-up delay-3">
                      <div className="stat-icon"><FiLayers /></div>
                      <div className="stat-number">99.9%</div>
                      <div className="stat-label">Uptime</div>
                    </div>
                  </Col>
                </Row>
              </div>
            </Col>
            <Col lg={6} md={12}>
              <div className="about-image fade-in-right">
                <div className="image-container glass">
                  <div className="image-overlay"></div>
                  <div className="image-content">Platform Dashboard</div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section id="login" className="login-section">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h2 className="mb-3">Get Started Today</h2>
              <p className="section-subtitle mb-5">Create an account or log in to access our platform</p>
            </Col>
          </Row>
          <Login />
        </Container>
      </section>

      <section id="contact" className="contact-section">
        <Container>
          <Row className="justify-content-center text-center mb-5">
            <Col lg={8}>
              <h2 className="mb-3">Contact Us</h2>
              <p className="section-subtitle mb-5">Have questions? We're here to help</p>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col lg={10}>
              <Row className="contact-info">
                <Col md={4} sm={12} className="mb-4">
                  <div className="contact-item card hover-effect h-100">
                    <div className="card-body text-center">
                      <div className="contact-icon mb-3">📧</div>
                      <h3 className="h5 mb-3">Email</h3>
                      <p className="mb-0">info@cape-control.com</p>
                    </div>
                  </div>
                </Col>
                <Col md={4} sm={12} className="mb-4">
                  <div className="contact-item card hover-effect h-100">
                    <div className="card-body text-center">
                      <div className="contact-icon mb-3">📱</div>
                      <h3 className="h5 mb-3">Phone</h3>
                      <p className="mb-0">+1 (123) 456-7890</p>
                    </div>
                  </div>
                </Col>
                <Col md={4} sm={12} className="mb-4">
                  <div className="contact-item card hover-effect h-100">
                    <div className="card-body text-center">
                      <div className="contact-icon mb-3">🌐</div>
                      <h3 className="h5 mb-3">Social</h3>
                      <div className="social-links d-flex justify-content-center gap-3">
                        <a href="https://twitter.com" className="social-link" target="_blank" rel="noopener noreferrer">Twitter</a>
                        <a href="https://linkedin.com" className="social-link" target="_blank" rel="noopener noreferrer">LinkedIn</a>
                        <a href="https://github.com" className="social-link" target="_blank" rel="noopener noreferrer">GitHub</a>
                      </div>
                    </div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
