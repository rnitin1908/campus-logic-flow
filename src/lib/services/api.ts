
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Enable CORS credentials support
  withCredentials: true
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Add custom headers for better error tracking
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    
    return config;
  },
  (error) => {
    console.error('API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for handling common errors
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Log the error for debugging
    console.error('API Response Error:', error?.response?.data || error?.message || error);
    
    // Handle authentication errors
    if (error?.response?.status === 401) {
      // Token expired, redirect to login
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_user');
      // Only redirect if we're in a browser environment
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function to get the auth token
export const getAuthToken = (): string => {
  // Try to get from auth_token first (new MongoDB approach)
  const token = localStorage.getItem('auth_token');
  if (token) return token;
  
  // Fall back to legacy approach (Supabase)
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : '';
};

