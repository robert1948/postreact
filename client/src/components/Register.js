import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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

      // In a real app, the code would be sent to the user's email/phone
      // For demo purposes, we'll store it in state
      setVerificationCode(response.verificationCode);

      // Move to step 2
      setStep(2);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');

    if (!userCode) {
      setError('Please enter the verification code');
      return;
    }

    setIsLoading(true);

    try {
      // Verify the code with the server
      const verifyResponse = await authService.verifyCode({
        email: formData.email,
        code: userCode
      });

      if (verifyResponse.success) {
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
        setError('Verification failed');
      }
    } catch (error) {
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

    if (score === 0) {
      strengthClass = '';
      strengthText = '';
    } else if (score < 3) {
      strengthClass = 'weak';
      strengthText = 'Weak';
    } else if (score < 5) {
      strengthClass = 'medium';
      strengthText = 'Medium';
    } else {
      strengthClass = 'strong';
      strengthText = 'Strong';
    }

    return (
      <div className="password-strength">
        <div className="strength-meter">
          <div className={`strength-bar ${strengthClass}`} style={{ width: `${score * 20}%` }}></div>
        </div>
        {strengthText && <span className={`strength-text ${strengthClass}`}>{strengthText}</span>}

        <ul className="strength-requirements">
          <li className={hasMinLength ? 'met' : ''}>At least 8 characters</li>
          <li className={hasUppercase ? 'met' : ''}>At least one uppercase letter</li>
          <li className={hasLowercase ? 'met' : ''}>At least one lowercase letter</li>
          <li className={hasNumber ? 'met' : ''}>At least one number</li>
          <li className={hasSpecialChar ? 'met' : ''}>At least one special character</li>
        </ul>
      </div>
    );
  };

  // Render step 1: Registration form
  const renderStep1 = () => (
    <form onSubmit={handleSubmitStep1} className="register-form">
      <h2>Create Your Account</h2>
      <p className="form-description">Please fill in the details below to get started.</p>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="email">Email Address</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
          disabled={isLoading}
        />
        {validationErrors.email && (
          <span className="validation-error">{validationErrors.email}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="mobile">Mobile Number</label>
        <input
          type="tel"
          id="mobile"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          placeholder="Enter your mobile number"
          disabled={isLoading}
        />
        {validationErrors.mobile && (
          <span className="validation-error">{validationErrors.mobile}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="username">Username</label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Choose a username"
          disabled={isLoading}
        />
        {validationErrors.username && (
          <span className="validation-error">{validationErrors.username}</span>
        )}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
          disabled={isLoading}
        />
        {validationErrors.password && (
          <span className="validation-error">{validationErrors.password}</span>
        )}
        {formData.password && renderPasswordStrength()}
      </div>

      <div className="form-group">
        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
          disabled={isLoading}
        />
        {validationErrors.confirmPassword && (
          <span className="validation-error">{validationErrors.confirmPassword}</span>
        )}
      </div>

      <button
        type="submit"
        className={`submit-button ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Please wait...' : 'Continue'}
      </button>

      <div className="form-footer">
        <p>Already have an account? <a href="/login">Log in</a></p>
      </div>
    </form>
  );

  // Render step 2: Verification code
  const renderStep2 = () => (
    <form onSubmit={handleVerifyCode} className="verification-form">
      <h2>Verify Your Account</h2>
      <p className="form-description">
        We've sent a verification code to your email and mobile number.
        Please enter the code below to verify your account.
      </p>

      {error && <div className="error-message">{error}</div>}

      <div className="form-group">
        <label htmlFor="verificationCode">Verification Code</label>
        <input
          type="text"
          id="verificationCode"
          value={userCode}
          onChange={(e) => setUserCode(e.target.value)}
          placeholder="Enter verification code"
          disabled={isLoading}
        />
      </div>

      <button
        type="submit"
        className={`submit-button ${isLoading ? 'loading' : ''}`}
        disabled={isLoading}
      >
        {isLoading ? 'Verifying...' : 'Verify Code'}
      </button>

      <div className="form-footer">
        <p>Didn't receive a code? <button type="button" className="text-button">Resend Code</button></p>
      </div>
    </form>
  );

  // Render step 3: Success
  const renderStep3 = () => (
    <div className="success-container">
      <div className="success-icon">✓</div>
      <h2>Registration Successful!</h2>
      <p>Your account has been created successfully.</p>
      <button
        onClick={handleComplete}
        className="submit-button"
      >
        Go to Dashboard
      </button>
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
    <div className="register-container">
      <div className="register-progress">
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

      <div className="help-section">
        <h3>Need Help?</h3>
        <p>If you're having trouble registering, please check our <a href="/faq">FAQ</a> or <a href="/contact">contact support</a>.</p>
      </div>
    </div>
  );
};

export default Register;
