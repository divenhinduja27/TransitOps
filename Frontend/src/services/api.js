import axios from 'axios';

/**
 * Axios instance configured with default settings.
 * Update the baseURL to match your backend API endpoint.
 */
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Request interceptor - attach auth token to outgoing requests.
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor - handle common response errors globally.
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status } = error.response;

      if (status === 401) {
        // Unauthorized - clear token and redirect to login
        localStorage.removeItem('token');
        window.location.href = '/login';
      }

      if (status === 403) {
        console.error('Access denied.');
      }

      if (status === 500) {
        console.error('Internal server error.');
      }
    }

    return Promise.reject(error);
  }
);

export default api;
