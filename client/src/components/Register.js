import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button, Card, Alert, ProgressBar } from 'react-bootstrap';
import authService from '../services/auth';
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [userCode, setUserCode] = useState('');

  // Form data state
  const [formData, setFormData] = useState({
    email: '',
    mobile: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  // Validation errors state
  const [validationErrors, setValidationErrors] = useState({});

  // Password strength indicators
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    hasMinLength: false,
    hasUppercase: false,
    hasLowercase: false,
    hasNumber: false,
    hasSpecialChar: false
  });

  // Handle input changes
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

    // Check password strength if password field is changed
    if (name === 'password') {
      checkPasswordStrength(value);
    }
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    const hasMinLength = password.length >= 8;
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    // Calculate score (0-5)
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecialChar) score++;

    setPasswordStrength({
      score,
      hasMinLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar
    });
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    // Email validation
    if (!formData.email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Invalid email format';
    }

    // Mobile validation
    if (!formData.mobile) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(formData.mobile.replace(/[^0-9]/g, ''))) {
      errors.mobile = 'Mobile number must be 10 digits';
    }

    // Username validation
    if (!formData.username) {
      errors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }

    // Password validation
    if (!formData.password) {
      errors.password = 'Password is required';
    } else if (passwordStrength.score < 3) {
      errors.password = 'Password is too weak';
    }

    // Confirm password validation
    if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission for step 1
  const handleSubmitStep1 = async (e) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Send registration data to server and get verification code
      const response = await authService.requestVerification({
        email: formData.email,
        mobile: formData.mobile
      });

      console.log('Registration response:', response);

      // In a real app, the code would be sent to the user's email/phone
      // For demo purposes, we'll store it in state
      if (response && response.verificationCode) {
        setVerificationCode(response.verificationCode);
        console.log('Verification code set in state:', response.verificationCode);

        // Display the code to the user (for demo purposes only)
        alert(`For demo purposes, your verification code is: ${response.verificationCode}\n\nIn a real app, this would be sent to your email or phone.`);

        // Move to step 2
        setStep(2);
      } else {
        console.error('No verification code in response');
        setError('Failed to get verification code. Please try again.');
      }
    } catch (error) {
      console.error('Registration error:', error);
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    console.log('Submitting verification code:', userCode);
    console.log('Expected verification code:', verificationCode);

    if (!userCode) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);

    // For demo purposes, also allow direct comparison with the code in state
    if (userCode === verificationCode) {
      console.log('Verification code matches directly!');

      try {
        // Register the user
        await authService.register({
          email: formData.email,
          mobile: formData.mobile,
          username: formData.username,
          password: formData.password
        });

        // Move to success step
        setStep(3);
        return;
      } catch (error) {
        console.error('Registration error after direct verification:', error);
        setError(error.response?.data?.message || 'An error occurred during registration');
        setIsLoading(false);
        return;
      }
    }

    try {
      // Verify the code with the server
      console.log('Sending verification code to server:', {
        email: formData.email,
        code: userCode
      });

      const verifyResponse = await authService.verifyCode({
        email: formData.email,
        code: userCode
      });

      console.log('Verification response:', verifyResponse);

      if (verifyResponse.success) {
        console.log('Server verification successful');

        // Register the user
        await authService.register({
          email: formData.email,
          mobile: formData.mobile,
          username: formData.username,
          password: formData.password
        });

        // Move to success step
        setStep(3);
      } else {
        console.error('Server verification failed');
        setError('Verification failed');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle completion and redirect to dashboard
  const handleComplete = () => {
    navigate('/dashboard');
  };

  // Render password strength indicators
  const renderPasswordStrength = () => {
    const { score, hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecialChar } = passwordStrength;

    let strengthClass = '';
    let strengthText = '';
    let variant = '';

    if (score === 0) {
      strengthClass = '';
      strengthText = '';
      variant = '';
    } else if (score < 3) {
      strengthClass = 'weak';
      strengthText = 'Weak';
      variant = 'danger';
    } else if (score < 5) {
      strengthClass = 'medium';
      strengthText = 'Medium';
      variant = 'warning';
    } else {
      strengthClass = 'strong';
      strengthText = 'Strong';
      variant = 'success';
    }

    return (
      <div className="password-strength mb-3">
        {score > 0 && (
          <div className="d-flex align-items-center mb-2">
            <ProgressBar
              now={score * 20}
              variant={variant}
              className="flex-grow-1 me-2"
              style={{ height: '8px' }}
            />
            {strengthText && <span className={`strength-text ${strengthClass}`}>{strengthText}</span>}
          </div>
        )}

        <ul className="strength-requirements list-unstyled small">
          <li className={hasMinLength ? 'text-success' : 'text-muted'}>
            <i className={`bi ${hasMinLength ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
            At least 8 characters
          </li>
          <li className={hasUppercase ? 'text-success' : 'text-muted'}>
            <i className={`bi ${hasUppercase ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
            At least one uppercase letter
          </li>
          <li className={hasLowercase ? 'text-success' : 'text-muted'}>
            <i className={`bi ${hasLowercase ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
            At least one lowercase letter
          </li>
          <li className={hasNumber ? 'text-success' : 'text-muted'}>
            <i className={`bi ${hasNumber ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
            At least one number
          </li>
          <li className={hasSpecialChar ? 'text-success' : 'text-muted'}>
            <i className={`bi ${hasSpecialChar ? 'bi-check-circle-fill' : 'bi-circle'} me-2`}></i>
            At least one special character
          </li>
        </ul>
      </div>
    );
  };

  // Render step 1: Registration form
  const renderStep1 = () => (
    <Form onSubmit={handleSubmitStep1}>
      <h4 className="text-center mb-3">Create Your Account</h4>
      <p className="text-center text-muted mb-4">Please fill in the details below to get started.</p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="email">Email Address</Form.Label>
        <Form.Control
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          disabled={isLoading}
          isInvalid={!!validationErrors.email}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.email}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="mobile">Mobile Number</Form.Label>
        <Form.Control
          type="tel"
          id="mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Enter your mobile number"
          disabled={isLoading}
          isInvalid={!!validationErrors.mobile}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.mobile}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          disabled={isLoading}
          isInvalid={!!validationErrors.username}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.username}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          disabled={isLoading}
          isInvalid={!!validationErrors.password}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.password}
        </Form.Control.Feedback>
        {formData.password && renderPasswordStrength()}
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label htmlFor="confirmPassword">Confirm Password</Form.Label>
        <Form.Control
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          disabled={isLoading}
          isInvalid={!!validationErrors.confirmPassword}
        />
        <Form.Control.Feedback type="invalid">
          {validationErrors.confirmPassword}
        </Form.Control.Feedback>
      </Form.Group>

      <div className="d-grid gap-2 mb-4">
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'Please wait...' : 'Continue'}
        </Button>
      </div>

      <div className="oauth-divider my-4">
        <span>OR</span>
      </div>

      <div className="d-grid gap-2 mb-4">
        <a href="/api/auth/google" className="oauth-button google">
          <div className="oauth-icon">G</div>
          <span>Continue with Google</span>
        </a>
        {/* LinkedIn login temporarily disabled
        <a href="/api/auth/linkedin" className="oauth-button linkedin">
          <div className="oauth-icon">in</div>
          <span>Continue with LinkedIn</span>
        </a>
        */}
      </div>

      <div className="text-center">
        <p>Already have an account? <a href="/login">Log in</a></p>
      </div>
    </Form>
  );

  // Render step 2: Verification code
  const renderStep2 = () => (
    <Form onSubmit={handleVerifyCode}>
      <h4 className="text-center mb-3">Verify Your Account</h4>
      <p className="text-center text-muted mb-4">
        We've sent a verification code to your email and mobile number.
        Please enter the code below to verify your account.
      </p>

      {error && <Alert variant="danger">{error}</Alert>}

      <Form.Group className="mb-4">
        <Form.Label htmlFor="verificationCode">Verification Code</Form.Label>
        <Form.Control
          type="text"
          id="verificationCode"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder="Enter verification code"
          disabled={isLoading}
        />
      </Form.Group>

      <div className="d-grid gap-2 mb-4">
        <Button
          variant="primary"
          type="submit"
          disabled={isLoading}
          className={isLoading ? 'loading' : ''}
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </Button>
      </div>

      <div className="text-center">
        <p>Didn't receive a code? <Button variant="link" size="sm" onClick={() => {}}>Resend Code</Button></p>
      </div>
    </Form>
  );

  // Render step 3: Success
  const renderStep3 = () => (
    <div className="text-center py-4">
      <div className="success-icon mb-3">✓</div>
      <h4 className="mb-3">Registration Successful!</h4>
      <p className="text-muted mb-4">Your account has been created successfully.</p>
      <div className="d-grid gap-2">
        <Button
          variant="primary"
          onClick={handleComplete}
        >
          Go to Dashboard
        </Button>
      </div>
    </div>
  );

  // Render the appropriate step
  const renderStep = () => {
    switch (step) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep1();
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col xs={12} sm={10} md={8} lg={6}>
          <Card className="register-container shadow">
            <Card.Body>
              <div className="register-progress mb-4">
                <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
                  <div className="step-number">1</div>
                  <div className="step-label">Account Details</div>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
                  <div className="step-number">2</div>
                  <div className="step-label">Verification</div>
                </div>
                <div className="progress-line"></div>
                <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
                  <div className="step-number">3</div>
                  <div className="step-label">Complete</div>
                </div>
              </div>

              {renderStep()}
            </Card.Body>
          </Card>

          <Card className="mt-4 shadow">
            <Card.Body>
              <h5 className="mb-3">Need Help?</h5>
              <p className="mb-0">If you're having trouble registering, please check our <a href="/faq">FAQ</a> or <a href="/contact">contact support</a>.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
