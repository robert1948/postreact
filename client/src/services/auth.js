import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? '/api/auth'  // Use relative URL in production
  : 'http://localhost:5000/api/auth';

export const authService = {
  async login(credentials) {
    console.log('Sending login request to:', `${API_URL}/login`);
    console.log('With credentials:', JSON.stringify(credentials));

    try {
      const response = await axios.post(`${API_URL}/login`, credentials);
      console.log('Login response:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        // Store user data if available
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },

  async register(userData) {
    console.log('Sending registration request to:', `${API_URL}/register`);
    console.log('With user data:', JSON.stringify(userData));

    try {
      const response = await axios.post(`${API_URL}/register`, userData);
      console.log('Registration response:', response.data);

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);

        // Store user data if available
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
      }
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
      }
      throw error;
    }
  },

  async requestVerification(userData) {
    // Send the verification request to the server
    try {
      const response = await axios.post(`${API_URL}/request-verification`, userData);
      console.log('Server response:', response.data);

      // Check if the verification code is in the response
      if (response.data && response.data.verificationCode) {
        console.log('Verification code received:', response.data.verificationCode);
      } else {
        console.error('No verification code in response:', response.data);
      }

      return response.data;
    } catch (error) {
      console.error('Error requesting verification:', error);
      throw error;
    }
  },

  async verifyCode(verificationData) {
    // Send the verification code to the server for validation
    const response = await axios.post(`${API_URL}/verify-code`, verificationData);
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  getToken() {
    return localStorage.getItem('token');
  },

  isAuthenticated() {
    return !!this.getToken();
  }
};

export default authService;
