import React, { useState } from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Logout from './Logout';
import './DashboardHeader.css';

const DashboardHeader = () => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Navbar expand="md" className="dashboard-header" expanded={expanded} onToggle={setExpanded}>
      <Container fluid>
        <Navbar.Brand className="dashboard-logo">CapeControl</Navbar.Brand>
        <Navbar.Toggle aria-controls="dashboard-navbar" />
        <Navbar.Collapse id="dashboard-navbar">
          <Nav className="me-auto">
            <Nav.Link href="#dashboard" className="active">Dashboard</Nav.Link>
            <Nav.Link href="#profile">Profile</Nav.Link>
            <Nav.Link href="#settings">Settings</Nav.Link>
          </Nav>
          <div className="dashboard-actions">
            <Logout />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DashboardHeader;
