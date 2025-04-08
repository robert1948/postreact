import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

  // Log component state when mounted
  useEffect(() => {
    console.log('Login component mounted');
    console.log('Initial form data:', formData);
  }, []);

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
      if (isLogin) {
        // For login, only send email and password
        const loginData = {
          email: formData.email,
          password: formData.password
        };
        console.log('Login data:', loginData);
        await authService.login(loginData);
      } else {
        // For registration, send all form data
        console.log('Registration data:', formData);
        await authService.register(formData);
      }

      navigate('/dashboard');
    } catch (error) {
      console.error('Authentication error:', error);
      setError(error.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input change - Field: ${name}, Value: ${value}`);

    setFormData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };
      console.log('Updated form data:', newData);
      return newData;
    });

    // Clear validation error when user starts typing
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-tabs">
        <button
          className={isLogin ? 'active' : ''}
          onClick={() => {
            setIsLogin(true);
            setError('');
            setValidationErrors({});
          }}
          disabled={isLoading}
        >
          Login
        </button>
        <button
          className={!isLogin ? 'active' : ''}
          onClick={() => {
            setIsLogin(false);
            setError('');
            setValidationErrors({});
          }}
          disabled={isLoading}
        >
          Register
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
              placeholder="Enter your name"
              disabled={isLoading}
            />
            {validationErrors.name && (
              <span className="validation-error">{validationErrors.name}</span>
            )}
          </div>
        )}

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            placeholder="Enter your email"
            disabled={isLoading}
          />
          {validationErrors.email && (
            <span className="validation-error">{validationErrors.email}</span>
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
            required
            placeholder="Enter your password"
            disabled={isLoading}
          />
          {validationErrors.password && (
            <span className="validation-error">{validationErrors.password}</span>
          )}
        </div>

        <button
          type="submit"
          className={`submit-button ${isLoading ? 'loading' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : (isLogin ? 'Login' : 'Register')}
        </button>

        <div className="oauth-divider">
          <span>OR</span>
        </div>

        <div className="oauth-buttons">
          <a href="/api/auth/google" className="oauth-button google">
            <div className="oauth-icon">G</div>
            <span>Continue with Google</span>
          </a>
          <a href="/api/auth/linkedin" className="oauth-button linkedin">
            <div className="oauth-icon">in</div>
            <span>Continue with LinkedIn</span>
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
