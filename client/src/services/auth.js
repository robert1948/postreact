import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const authService = {
  async login(credentials) {
    const response = await axios.post(`${API_URL}/login`, credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  async register(userData) {
    const response = await axios.post(`${API_URL}/register`, userData);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },

  logout() {
    localStorage.removeItem('token');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  getToken() {
    return localStorage.getItem('token');
  }
};

export default authService;