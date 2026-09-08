import axios from 'axios';

// Get base URL from env or fallback based on environment
const getBaseURL = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  return import.meta.env.MODE === 'production' ? '/api' : 'http://localhost:5001/api';
};

const API = axios.create({
  baseURL: getBaseURL()
});

// Automatically attach JWT token to requests
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export default API;