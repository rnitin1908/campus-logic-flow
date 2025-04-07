
import axios from 'axios';
import { apiClient } from './api';

// Default user roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'school_admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  ACCOUNTANT: 'accountant',
  LIBRARIAN: 'librarian',
  RECEPTIONIST: 'receptionist',
  TRANSPORT_MANAGER: 'transport_manager',
};

// Login with MongoDB backend
export const login = async (email: string, password: string) => {
  try {
    console.log("Using MongoDB service for login");
    const response = await apiClient.post('/auth/login', { email, password });
    
    if (!response.data) {
      throw new Error('No data returned from login');
    }
    
    // Store user data in localStorage with the same structure as Supabase
    const userData = {
      id: response.data.id,
      name: response.data.name || email.split('@')[0],
      email: response.data.email,
      role: response.data.role || USER_ROLES.STUDENT,
      schoolId: response.data.schoolId || null,
      schoolName: response.data.schoolName || null,
      token: response.data.token,
    };
    
    localStorage.setItem('user', JSON.stringify(userData));
    return userData;
  } catch (error: any) {
    console.error('MongoDB login error:', error);
    throw error.response?.data?.message || error.message || 'Login failed';
  }
};

// Register with MongoDB backend
export const register = async (name: string, email: string, password: string, role: string = USER_ROLES.STUDENT) => {
  try {
    console.log("Using MongoDB service for registration");
    const response = await apiClient.post('/auth/register', {
      name,
      email,
      password,
      role
    });
    
    return response.data;
  } catch (error: any) {
    console.error('MongoDB registration error:', error);
    throw error.response?.data?.message || error.message || 'Registration failed';
  }
};

// Logout
export const logout = () => {
  localStorage.removeItem('user');
};

// Get current user profile
export const getUserProfile = async () => {
  try {
    const response = await apiClient.get('/auth/profile');
    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
};

// Create test users with MongoDB
export const createTestUsers = async () => {
  try {
    console.log("Creating test users via MongoDB");
    
    const testUsers = [
      { name: "Super Admin", email: "superadmin@campuscore.edu", password: "Password123!", role: "admin" },
      { name: "School Admin", email: "schooladmin@campuscore.edu", password: "Password123!", role: "admin" },
      { name: "Teacher", email: "teacher@campuscore.edu", password: "Password123!", role: "teacher" },
      { name: "Student", email: "student@campuscore.edu", password: "Password123!", role: "student" }
    ];
    
    const results = [];
    
    for (const user of testUsers) {
      try {
        // Try to register the user
        const response = await apiClient.post('/auth/register', user);
        
        results.push({
          name: user.name,
          email: user.email,
          role: user.role,
          password: user.password,
          status: 'Created',
          message: 'User created successfully'
        });
      } catch (error: any) {
        // Check if user already exists error
        if (error.response?.status === 400 && error.response?.data?.message?.includes('already exists')) {
          results.push({
            name: user.name,
            email: user.email,
            role: user.role,
            password: user.password,
            status: 'Exists',
            message: 'User already exists, can be used for login'
          });
        } else {
          results.push({
            name: user.name,
            email: user.email,
            role: user.role,
            password: user.password,
            status: 'Error',
            message: error.response?.data?.message || error.message || 'Unknown error'
          });
        }
      }
    }
    
    return results;
  } catch (error: any) {
    console.error('Create test users error:', error);
    throw error;
  }
};

// Check if MongoDB API is configured
export const isMongoDBConfigured = () => {
  const apiUrl = import.meta.env.VITE_API_URL;
  return !!apiUrl;
};

// Student-related functions to match Supabase student service
export const createStudent = async (studentData: any) => {
  try {
    const response = await apiClient.post('/students', studentData);
    return response.data;
  } catch (error) {
    console.error('Error creating student:', error);
    throw error;
  }
};

export const updateStudent = async (id: string, studentData: any) => {
  try {
    const response = await apiClient.put(`/students/${id}`, studentData);
    return response.data;
  } catch (error) {
    console.error('Error updating student:', error);
    throw error;
  }
};

export const deleteStudent = async (id: string) => {
  try {
    const response = await apiClient.delete(`/students/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting student:', error);
    throw error;
  }
};

// Export MongoDB service
export const mongodbService = {
  login,
  register,
  logout,
  getUserProfile,
  createTestUsers,
  isMongoDBConfigured,
  USER_ROLES,
  // Add student-related functions to the service object
  createStudent,
  updateStudent,
  deleteStudent
};

export default mongodbService;
