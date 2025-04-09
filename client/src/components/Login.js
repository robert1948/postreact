import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Nav, Alert, Card } from 'react-bootstrap';
import authService from '../services/auth';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !formData.name) {
      errors.name = 'Name is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Call the authentication service and navigate on success
      await (isLogin
        ? authService.login(formData)
        : authService.register(formData));

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="auth-container shadow">
            <Card.Body>
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link
                    active={isLogin}
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                      setValidationErrors({});
                    }}
                    disabled={isLoading}
                    className="auth-tab"
                  >
                    Login
                  </Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link
                    active={!isLogin}
                    onClick={() => {
                      setIsLogin(false);
                      setError('');
                      setValidationErrors({});
                    }}
                    disabled={isLoading}
                    className="auth-tab"
                  >
                    Register
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit}>
                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="name">Name</Form.Label>
                    <Form.Control
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name || ''}
                      onChange={handleChange}
                      required={!isLogin}
                      placeholder="Enter your name"
                      disabled={isLoading}
                      isInvalid={!!validationErrors.name}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.name}
                    </Form.Control.Feedback>
                  </Form.Group>
                )}

                <Form.Group className="mb-3">
                  <Form.Label htmlFor="email">Email</Form.Label>
                  <Form.Control
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                    disabled={isLoading}
                    isInvalid={!!validationErrors.email}
                    autoComplete="email"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                    disabled={isLoading}
                    isInvalid={!!validationErrors.password}
                    autoComplete="current-password"
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.password}
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button
                    variant="primary"
                    type="submit"
                    disabled={isLoading}
                    className={isLoading ? 'loading' : ''}
                  >
                    {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
                  </Button>
                </div>

                <div className="oauth-divider my-4">
                  <span>OR</span>
                </div>

                <div className="d-grid gap-2">
                  <a
                    href={process.env.NODE_ENV === 'production'
                      ? 'https://www.cape-control.com/api/auth/google'
                      : 'http://localhost:5000/api/auth/google'}
                    className="oauth-button google"
                  >
                    <div className="oauth-icon">G</div>
                    <span>Continue with Google</span>
                  </a>
                  {/* LinkedIn login temporarily disabled
                  <a
                    href={process.env.NODE_ENV === 'production'
                      ? 'https://www.cape-control.com/api/auth/linkedin'
                      : 'http://localhost:5000/api/auth/linkedin'}
                    className="oauth-button linkedin"
                  >
                    <div className="oauth-icon">in</div>
                    <span>Continue with LinkedIn</span>
                  </a>
                  */}
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
