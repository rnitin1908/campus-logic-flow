import { apiClient } from './api';
import { Student, StudentFormData } from '@/types/student';

export const mongodbService = {
  // Auth methods
  login: async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
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
      const response = await apiClient.post('/auth/register', { name, email, password });
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
      const response = await apiClient.get('/students');
      return response.data;
    } catch (error) {
      console.error('Get students error:', error);
      throw error;
    }
  },

  getStudentById: async (id: string): Promise<Student> => {
    try {
      const response = await apiClient.get(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get student error:', error);
      throw error;
    }
  },

  createStudent: async (studentData: StudentFormData): Promise<Student> => {
    try {
      const response = await apiClient.post('/students', studentData);
      return response.data;
    } catch (error) {
      console.error('Create student error:', error);
      throw error;
    }
  },

  updateStudent: async (id: string, studentData: Partial<Student>): Promise<Student> => {
    try {
      const response = await apiClient.put(`/students/${id}`, studentData);
      return response.data;
    } catch (error) {
      console.error('Update student error:', error);
      throw error;
    }
  },

  deleteStudent: async (id: string) => {
    try {
      const response = await apiClient.delete(`/students/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete student error:', error);
      throw error;
    }
  },

  // Import multiple students at once (mock implementation)
  importStudents: async (students: StudentFormData[]): Promise<{ success: boolean, count: number }> => {
    try {
      // For now, we'll import students one by one
      for (const student of students) {
        await apiClient.post('/students', student);
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
      const response = await apiClient.get('/staff');
      return response.data;
    } catch (error) {
      console.error('Get staff error:', error);
      throw error;
    }
  },

  getStaffById: async (id: string) => {
    try {
      const response = await apiClient.get(`/staff/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get staff error:', error);
      throw error;
    }
  },

  createStaff: async (staffData: any) => {
    try {
      const response = await apiClient.post('/staff', staffData);
      return response.data;
    } catch (error) {
      console.error('Create staff error:', error);
      throw error;
    }
  },

  updateStaff: async (id: string, staffData: any) => {
    try {
      const response = await apiClient.put(`/staff/${id}`, staffData);
      return response.data;
    } catch (error) {
      console.error('Update staff error:', error);
      throw error;
    }
  },

  deleteStaff: async (id: string) => {
    try {
      const response = await apiClient.delete(`/staff/${id}`);
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

export default mongodbService;
