
import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Update this with your actual API URL

export const mongodbService = {
  // Auth methods
  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { email, password });
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data));
      }
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (name: string, email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, { name, email, password });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('user');
  },

  // Student methods
  getStudents: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/students`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Get students error:', error);
      throw error;
    }
  },

  // Staff methods
  getStaff: async () => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/staff`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Get staff error:', error);
      throw error;
    }
  },

  // Utility functions
  getCurrentUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },
};

// Helper function to get the auth token
const getAuthToken = (): string => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user).token : '';
};

export default mongodbService;
