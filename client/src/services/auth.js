import axios from 'axios';

const API_URL = process.env.NODE_ENV === 'production'
  ? '/api/auth'  // Use relative URL in production
  : 'http://localhost:5000/api/auth';

export const authService = {
  async login(credentials) {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);

      // Store user data if available
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },

  async register(userData) {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);

      // Store user data if available
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
    }
    return response.data;
  },

  async requestVerification(userData) {
    // Send the verification request to the server
    const response = await axios.post(`${API_URL}/request-verification`, userData);
    console.log('Server response:', response.data);
    return response.data;
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
