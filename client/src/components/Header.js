import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { ThemeContext } from '../context/ThemeContext';
import ThemeToggle from './ThemeToggle';
import './Header.css';

const Header = () => {
  const token = localStorage.getItem('token');
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme } = useContext(ThemeContext);
  const location = useLocation();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Toggle mobile menu
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Close mobile menu when clicking on a link
  const closeMenu = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
  };

  // Check if a link is active
  const isActive = (path) => {
    if (path.startsWith('#')) {
      return location.hash === path;
    }
    return location.pathname === path;
  };

  return (
    <Navbar
      expand="lg"
      className={`header ${isScrolled ? 'scrolled' : ''} ${theme === 'light' ? 'light-theme' : ''}`}
      variant={theme === 'light' ? 'light' : 'dark'}
      fixed="top"
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="logo fade-in-left">CapeControl</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" onClick={toggleMobileMenu} />
        <Navbar.Collapse id="basic-navbar-nav" className={mobileMenuOpen ? 'show' : ''}>
          <Nav className="ms-auto">
            <Nav.Item>
              <Nav.Link
                href="#features"
                className={`fade-in-down delay-1 ${isActive('#features') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Features
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="#about"
                className={`fade-in-down delay-2 ${isActive('#about') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                About
              </Nav.Link>
            </Nav.Item>
            <Nav.Item>
              <Nav.Link
                href="#contact"
                className={`fade-in-down delay-3 ${isActive('#contact') ? 'active' : ''}`}
                onClick={closeMenu}
              >
                Contact
              </Nav.Link>
            </Nav.Item>
            {token ? (
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/dashboard"
                  className={`fade-in-down delay-4 ${isActive('/dashboard') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <Button variant="primary" className="btn-pulse">Dashboard</Button>
                </Nav.Link>
              </Nav.Item>
            ) : (
              <Nav.Item>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`fade-in-down delay-4 ${isActive('/login') ? 'active' : ''}`}
                  onClick={closeMenu}
                >
                  <Button variant="primary" className="btn-pulse">Login</Button>
                </Nav.Link>
              </Nav.Item>
            )}
            <Nav.Item className="d-flex align-items-center ms-2 fade-in-down delay-5">
              <ThemeToggle />
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Header;
