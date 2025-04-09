import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
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

      <Container>
        <Row className="mb-4">
          <Col>
            <h1 className="text-center">Welcome to Your Dashboard, {username}</h1>
          </Col>
        </Row>

        <Row>
          <Col>
            <div className="dashboard-content">
              <Card className="dashboard-card mb-4">
                <Card.Body>
                  <h2>Overview</h2>
                  <p>You're successfully logged in! This is your personal dashboard where you can manage your account and access our platform's features.</p>
                </Card.Body>
              </Card>

              <Card className="dashboard-card">
                <Card.Body>
                  <h2>Quick Actions</h2>
                  <Row className="dashboard-actions-grid">
                    <Col lg={3} md={6} sm={6} xs={12} className="mb-4">
                      <Card className="dashboard-action-card h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                          <div className="action-icon mb-3">📊</div>
                          <h3>View Analytics</h3>
                          <p className="text-center">Check your usage statistics</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} md={6} sm={6} xs={12} className="mb-4">
                      <Card className="dashboard-action-card h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                          <div className="action-icon mb-3">⚙️</div>
                          <h3>Settings</h3>
                          <p className="text-center">Manage your account settings</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} md={6} sm={6} xs={12} className="mb-4">
                      <Card className="dashboard-action-card h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                          <div className="action-icon mb-3">📝</div>
                          <h3>Create New</h3>
                          <p className="text-center">Start a new project</p>
                        </Card.Body>
                      </Card>
                    </Col>
                    <Col lg={3} md={6} sm={6} xs={12} className="mb-4">
                      <Card className="dashboard-action-card h-100">
                        <Card.Body className="d-flex flex-column align-items-center">
                          <div className="action-icon mb-3">🔍</div>
                          <h3>Explore</h3>
                          <p className="text-center">Discover new features</p>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;