import React, { useState, useEffect } from 'react';
import { FiCpu, FiRefreshCw, FiBarChart2, FiShield } from 'react-icons/fi';
import { Container, Row, Col } from 'react-bootstrap';
import './FeatureSection.css';

// Mobile styles
const mobileStyles = {
  featureColumn: {
    width: '100%',
    padding: '0.75rem',
    marginBottom: '1rem'
  },
  featureCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '2rem 1.5rem',
    textAlign: 'center',
    width: '100%',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
  },
  featureIcon: {
    margin: '0 auto 1.5rem',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  featureTitle: {
    fontSize: '1.5rem',
    marginBottom: '1rem',
    color: 'white',
    textAlign: 'center',
    width: '100%'
  },
  featureDesc: {
    fontSize: '1.1rem',
    lineHeight: '1.6',
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    width: '100%'
  }
};

const FeatureSection = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Update isMobile state on component mount and window resize
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Set initial value
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const features = [
    {
      id: 1,
      title: 'AI-Powered Insights',
      description: 'Leverage advanced AI algorithms to gain valuable insights from your data.',
      icon: <FiCpu size={40} />,
      delay: 'delay-1'
    },
    {
      id: 2,
      title: 'Seamless Integration',
      description: 'Easily integrate with your existing tools and workflows.',
      icon: <FiRefreshCw size={40} />,
      delay: 'delay-2'
    },
    {
      id: 3,
      title: 'Real-time Analytics',
      description: 'Monitor and analyze your data in real-time for immediate decision making.',
      icon: <FiBarChart2 size={40} />,
      delay: 'delay-3'
    },
    {
      id: 4,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee.',
      icon: <FiShield size={40} />,
      delay: 'delay-4'
    }
  ];

  return (
    <section id="features" className="feature-section">
      <Container fluid className="px-2 px-md-3">
        <div className="section-header fade-in">
          <h2 className="text-gradient">Key Features</h2>
          <p className="section-subtitle">Discover what makes our platform stand out</p>
        </div>

        <Row className="features-grid mx-0">
          {features.map(feature => (
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={3}
              key={feature.id}
              className="mb-4 feature-column px-2"
              style={isMobile ? mobileStyles.featureColumn : {}}
            >
              <div
                className={`feature-card fade-in-up ${feature.delay} hover-lift`}
                style={isMobile ? mobileStyles.featureCard : {}}
              >
                <div
                  className="feature-icon"
                  style={isMobile ? mobileStyles.featureIcon : {}}
                >
                  {feature.icon}
                </div>
                <h3 style={isMobile ? mobileStyles.featureTitle : {}}>
                  {feature.title}
                </h3>
                <p style={isMobile ? mobileStyles.featureDesc : {}}>
                  {feature.description}
                </p>
                <div className="feature-card-bg"></div>
              </div>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default FeatureSection;
