import React from 'react';
import './FeatureSection.css';

const FeatureSection = () => {
  const features = [
    {
      id: 1,
      title: 'AI-Powered Insights',
      description: 'Leverage advanced AI algorithms to gain valuable insights from your data.',
      icon: '🧠'
    },
    {
      id: 2,
      title: 'Seamless Integration',
      description: 'Easily integrate with your existing tools and workflows.',
      icon: '🔄'
    },
    {
      id: 3,
      title: 'Real-time Analytics',
      description: 'Monitor and analyze your data in real-time for immediate decision making.',
      icon: '📊'
    },
    {
      id: 4,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security with 99.9% uptime guarantee.',
      icon: '🔒'
    }
  ];

  return (
    <section id="features" className="feature-section">
      <h2>Key Features</h2>
      <p className="section-subtitle">Discover what makes our platform stand out</p>
      
      <div className="features-grid">
        {features.map(feature => (
          <div key={feature.id} className="feature-card">
            <div className="feature-icon">{feature.icon}</div>
            <h3>{feature.title}</h3>
            <p>{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;
