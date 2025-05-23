import { ROLES, USER_ROLES } from '@/lib/roles';
import { ClassFormData } from '@/types/class';
import { SchoolFormData } from '@/types/school';
import { StudentFormData } from '@/types/student';
import { UserFormData } from '@/types/user';

class MongodbService {
  private baseURL: string;
  private authToken: string | null;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
    this.authToken = null;
  }

  setAuthToken(token: string | null) {
    this.authToken = token;
  }

  getHeaders() {
    const headers: { [key: string]: string } = {
      'Content-Type': 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  async getSchools(params: { limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}) {
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }

    try {
      const response = await fetch(`${this.baseURL}/schools?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch schools: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching schools:', error);
      throw error;
    }
  }

  async createSchool(schoolData: SchoolFormData) {
    try {
      const response = await fetch(`${this.baseURL}/schools`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(schoolData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create school: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating school:', error);
      throw error;
    }
  }

  async updateSchool(id: string, schoolData: SchoolFormData) {
    try {
      const response = await fetch(`${this.baseURL}/schools/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(schoolData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update school: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating school:', error);
      throw error;
    }
  }

  async deleteSchool(id: string) {
    try {
      const response = await fetch(`${this.baseURL}/schools/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete school: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting school:', error);
      throw error;
    }
  }

  async getClasses(params: { limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}) {
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }

    try {
      const response = await fetch(`${this.baseURL}/classes?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch classes: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching classes:', error);
      throw error;
    }
  }

  async createClass(classData: ClassFormData) {
    try {
      const response = await fetch(`${this.baseURL}/classes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(classData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create class: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  }

  async updateClass(id: string, classData: ClassFormData) {
    try {
      const response = await fetch(`${this.baseURL}/classes/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(classData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update class: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating class:', error);
      throw error;
    }
  }

  async deleteClass(id: string) {
    try {
      const response = await fetch(`${this.baseURL}/classes/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete class: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting class:', error);
      throw error;
    }
  }

  async getStudents(params: { limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}) {
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }

    try {
      const response = await fetch(`${this.baseURL}/students?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
  }

  async createStudent(studentData: StudentFormData) {
    try {
      const response = await fetch(`${this.baseURL}/students`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          // Convert frontend data to MongoDB format
          first_name: studentData.first_name || studentData.name?.split(' ')[0] || '',
          last_name: studentData.last_name || studentData.name?.split(' ').slice(1).join(' ') || '',
          email: studentData.email,
          phone: studentData.phone || studentData.contactNumber || '',
          date_of_birth: studentData.date_of_birth || studentData.dateOfBirth,
          gender: studentData.gender,
          address: studentData.address,
          city: studentData.city || '',
          state: studentData.state || '',
          country: studentData.country || '',
          pincode: studentData.pincode || '',
          admission_number: studentData.admission_number || '',
          admission_date: studentData.admission_date || studentData.admissionDate,
          school_id: studentData.school_id || '',
          class_id: studentData.class_id || '',
          section: studentData.section || '',
          academic_year: studentData.academic_year || studentData.academicYear,
          roll_number: studentData.rollNumber || studentData.roll_number || '',
          department: studentData.department || '',
          status: studentData.status || 'active'
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to create student: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating student:', error);
      throw error;
    }
  }

  async updateStudent(id: string, studentData: Partial<StudentFormData>) {
    try {
      const response = await fetch(`${this.baseURL}/students/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify({
          // Convert frontend data to MongoDB format
          first_name: studentData.first_name,
          last_name: studentData.last_name,
          email: studentData.email,
          phone: studentData.phone || studentData.contactNumber,
          date_of_birth: studentData.date_of_birth || studentData.dateOfBirth,
          gender: studentData.gender,
          address: studentData.address,
          city: studentData.city,
          state: studentData.state,
          country: studentData.country,
          pincode: studentData.pincode,
          admission_number: studentData.admission_number,
          admission_date: studentData.admission_date || studentData.admissionDate,
          school_id: studentData.school_id,
          class_id: studentData.class_id,
          section: studentData.section,
          academic_year: studentData.academic_year || studentData.academicYear,
          roll_number: studentData.rollNumber || studentData.roll_number,
          department: studentData.department,
          status: studentData.status
        })
      });
      
      if (!response.ok) {
        throw new Error(`Failed to update student: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error updating student:', error);
      throw error;
    }
  }

  async deleteStudent(id: string) {
    try {
      const response = await fetch(`${this.baseURL}/students/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete student: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting student:', error);
      throw error;
    }
  }

  async getUsers(params: { limit?: number; sortBy?: string; sortOrder?: 'asc' | 'desc' } = {}) {
    const queryParams = new URLSearchParams();
    if (params.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params.sortBy) {
      queryParams.append('sortBy', params.sortBy);
    }
    if (params.sortOrder) {
      queryParams.append('sortOrder', params.sortOrder);
    }

    try {
      const response = await fetch(`${this.baseURL}/users?${queryParams.toString()}`, {
        method: 'GET',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch users: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async createUser(userData: UserFormData) {
    try {
      const response = await fetch(`${this.baseURL}/users`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`Failed to create user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: UserFormData) {
    try {
      const response = await fetch(`${this.baseURL}/users/${id}`, {
        method: 'PUT',
        headers: this.getHeaders(),
        body: JSON.stringify(userData)
      });

      if (!response.ok) {
        throw new Error(`Failed to update user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      const response = await fetch(`${this.baseURL}/users/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error(`Failed to delete user: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async login(credentials: { email: string; password: string }) {
    try {
      const response = await fetch(`${this.baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Invalid credentials');
      }

      const data = await response.json();
      this.setAuthToken(data.token);
      localStorage.setItem('auth_token', data.token);
      localStorage.setItem('auth_user', JSON.stringify(data.user));
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async logout() {
    this.setAuthToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
  }

  async register(userData: UserFormData) {
     try {
      const response = await fetch(`${this.baseURL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }
}

const mongodbService = new MongodbService();

export { ROLES, USER_ROLES };
export default mongodbService;
