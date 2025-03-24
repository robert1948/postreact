import axios from 'axios';
import authService from './auth';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const axiosInstance = axios.create({
  baseURL
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = authService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
