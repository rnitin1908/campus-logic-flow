import axios from 'axios';
import { Student, StudentFormData } from '@/types/student';

const API_URL = 'http://localhost:5000/api'; // Our Express API URL

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
  getStudents: async (): Promise<Student[]> => {
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

  getStudentById: async (id: string): Promise<Student> => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Get student error:', error);
      throw error;
    }
  },

  createStudent: async (studentData: StudentFormData): Promise<Student> => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_URL}/students`, studentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Create student error:', error);
      throw error;
    }
  },

  updateStudent: async (id: string, studentData: Partial<Student>): Promise<Student> => {
    try {
      const token = getAuthToken();
      const response = await axios.put(`${API_URL}/students/${id}`, studentData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Update student error:', error);
      throw error;
    }
  },

  deleteStudent: async (id: string) => {
    try {
      const token = getAuthToken();
      const response = await axios.delete(`${API_URL}/students/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Delete student error:', error);
      throw error;
    }
  },

  // Import multiple students at once (mock implementation)
  importStudents: async (students: StudentFormData[]): Promise<{ success: boolean, count: number }> => {
    try {
      const token = getAuthToken();
      
      // For now, we'll import students one by one
      for (const student of students) {
        await axios.post(`${API_URL}/students`, student, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      return { success: true, count: students.length };
    } catch (error) {
      console.error('Import students error:', error);
      throw error;
    }
  },

  // Staff methods - keeping these as they were
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

  getStaffById: async (id: string) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Get staff error:', error);
      throw error;
    }
  },

  createStaff: async (staffData: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(`${API_URL}/staff`, staffData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Create staff error:', error);
      throw error;
    }
  },

  updateStaff: async (id: string, staffData: any) => {
    try {
      const token = getAuthToken();
      const response = await axios.put(`${API_URL}/staff/${id}`, staffData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Update staff error:', error);
      throw error;
    }
  },

  deleteStaff: async (id: string) => {
    try {
      const token = getAuthToken();
      const response = await axios.delete(`${API_URL}/staff/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error) {
      console.error('Delete staff error:', error);
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
