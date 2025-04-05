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
    // In a real application, this would send the data to the server
    // and the server would generate and send a verification code
    // For demo purposes, we'll simulate this behavior

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Generate a random 6-digit code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    console.log('Verification code generated:', verificationCode);

    // In a real app, this would be sent via email/SMS by the server
    // For demo, we'll return it directly
    return {
      success: true,
      message: 'Verification code sent',
      verificationCode: verificationCode
    };
  },

  async verifyCode(verificationData) {
    // In a real application, this would verify the code on the server
    // For demo purposes, we'll simulate this behavior

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return {
      success: true,
      message: 'Verification successful'
    };
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
