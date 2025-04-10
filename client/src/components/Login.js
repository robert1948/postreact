import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Nav, Alert, Card } from 'react-bootstrap';
import authService from '../services/auth';
import './Login.css';

// Mobile styles
const mobileStyles = {
  container: {
    padding: 0,
    margin: 0,
    maxWidth: '100%',
    width: '100vw'
  },
  column: {
    padding: 0,
    width: '100%',
    maxWidth: '100%'
  },
  card: {
    borderRadius: 0,
    margin: 0,
    width: '100%',
    border: 'none',
    boxShadow: 'none'
  },
  cardBody: {
    padding: '1.5rem 1rem'
  },
  button: {
    padding: '1rem 1.2rem',
    fontSize: '1.1rem',
    width: '80%',
    margin: '0.75rem auto',
    display: 'block',
    borderRadius: '8px'
  },
  formControl: {
    padding: '0.9rem 1rem',
    fontSize: '1.1rem',
    marginBottom: '0.75rem',
    backgroundColor: 'rgba(42, 42, 42, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.2)'
  }
};

const Login = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  // Generate a random key to prevent browser autofill
  const [formKey, setFormKey] = useState(Math.random().toString(36).substring(7));

  // Clear form fields when component mounts
  useEffect(() => {
    setEmail('');
    setPassword('');
    setName('');
    // Generate a new form key to prevent browser autofill
    setFormKey(Math.random().toString(36).substring(7));
  }, []);

  const validateForm = () => {
    const errors = {};

    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email format';
    }

    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }

    if (!isLogin && !name) {
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
        ? authService.login({ email, password })
        : authService.register({ email, password, name }));

      navigate('/dashboard');
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    // Clear validation error when user starts typing
    if (validationErrors.email) {
      setValidationErrors(prev => ({
        ...prev,
        email: ''
      }));
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    // Clear validation error when user starts typing
    if (validationErrors.password) {
      setValidationErrors(prev => ({
        ...prev,
        password: ''
      }));
    }
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
    // Clear validation error when user starts typing
    if (validationErrors.name) {
      setValidationErrors(prev => ({
        ...prev,
        name: ''
      }));
    }
  };

  // State to track if we're on mobile
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

  // Force mobile layout update with key
  React.useEffect(() => {
    // Force rerender on component mount to apply mobile styles
    setFormKey(Math.random().toString(36).substring(7));
  }, []);

  return (
    <Container
      fluid
      className="py-5 login-container px-0"
      style={isMobile ? mobileStyles.container : {}}
    >
      <Row className="justify-content-center mx-0">
        <Col
          xs={12}
          sm={10}
          md={8}
          lg={6}
          className="px-0"
          style={isMobile ? mobileStyles.column : {}}
        >
          <Card
            className="auth-container shadow"
            style={isMobile ? mobileStyles.card : {}}
          >
            <Card.Body style={isMobile ? mobileStyles.cardBody : {}}>
              <Nav variant="tabs" className="mb-4">
                <Nav.Item>
                  <Nav.Link
                    active={isLogin}
                    onClick={() => {
                      setIsLogin(true);
                      setError('');
                      setValidationErrors({});
                      // Reset form fields
                      setEmail('');
                      setPassword('');
                      // Generate a new form key to prevent browser autofill
                      setFormKey(Math.random().toString(36).substring(7));
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
                      // Reset form fields
                      setEmail('');
                      setPassword('');
                      setName('');
                      // Generate a new form key to prevent browser autofill
                      setFormKey(Math.random().toString(36).substring(7));
                    }}
                    disabled={isLoading}
                    className="auth-tab"
                  >
                    Register
                  </Nav.Link>
                </Nav.Item>
              </Nav>

              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={handleSubmit} key={`${isLogin ? 'login' : 'register'}-${formKey}`}>
                {!isLogin && (
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="name">Name</Form.Label>
                    <Form.Control
                      type="text"
                      id={`name-${formKey}`}
                      name="name"
                      value={name}
                      onChange={handleNameChange}
                      required={!isLogin}
                      placeholder="Enter your name"
                      disabled={isLoading}
                      isInvalid={!!validationErrors.name}
                      autoComplete="new-password"
                      style={isMobile ? mobileStyles.formControl : {}}
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
                    id={`email-${formKey}`}
                    name="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                    placeholder="Enter your email"
                    disabled={isLoading}
                    isInvalid={!!validationErrors.email}
                    autoComplete="new-password"
                    style={isMobile ? mobileStyles.formControl : {}}
                  />
                  <Form.Control.Feedback type="invalid">
                    {validationErrors.email}
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label htmlFor="password">Password</Form.Label>
                  <Form.Control
                    type="password"
                    id={`password-${formKey}`}
                    name="password"
                    value={password}
                    onChange={handlePasswordChange}
                    required
                    placeholder="Enter your password"
                    disabled={isLoading}
                    isInvalid={!!validationErrors.password}
                    autoComplete="new-password"
                    style={isMobile ? mobileStyles.formControl : {}}
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
                    className={`form-submit-button ${isLoading ? 'loading' : ''}`}
                    style={isMobile ? mobileStyles.button : {}}
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
                    style={isMobile ? mobileStyles.button : {}}
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
