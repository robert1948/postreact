import React from 'react';
import { FiCpu, FiRefreshCw, FiBarChart2, FiShield } from 'react-icons/fi';
import { Container, Row, Col } from 'react-bootstrap';
import './FeatureSection.css';

const FeatureSection = () => {
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
      <Container>
        <div className="section-header fade-in">
          <h2 className="text-gradient">Key Features</h2>
          <p className="section-subtitle">Discover what makes our platform stand out</p>
        </div>

        <Row className="features-grid">
          {features.map(feature => (
            <Col xs={12} sm={6} lg={3} key={feature.id} className="mb-4">
              <div className={`feature-card fade-in-up ${feature.delay} hover-lift`}>
                <div className="feature-icon">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
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
