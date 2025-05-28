import axios from 'axios';
import { apiClient } from './api';
import { Student, StudentFormData, GenderType, StatusType } from '@/types/student';
// import { School } from '@/types/school';
// import { Class } from '@/types/class';

// Default user roles - matches Supabase roles
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

// Configure axios instance with authentication interceptor
const createAuthClient = () => {
const instance = axios.create({
baseURL: '/api',
headers: {
'Content-Type': 'application/json',
},
});

// Add auth token to requests
instance.interceptors.request.use(
(config) => {
const token = localStorage.getItem('auth_token');
if (token) {
config.headers['Authorization'] = `Bearer ${token}`;
}
return config;
},
(error) => {
return Promise.reject(error);
}
);

// Handle auth errors
instance.interceptors.response.use(
(response) => response,
(error) => {
if (error.response && error.response.status === 401) {
// Token expired or invalid, logout user
localStorage.removeItem('auth_token');
localStorage.removeItem('auth_user');
window.location.href = '/login';
}
return Promise.reject(error);
}
);

return instance;
};

// Create authenticated API client
const authClient = createAuthClient();

// Login with MongoDB backend
export const login = async (email: string, password: string, tenantSlug?: string) => {
try {
console.log(`Using MongoDB service for login with tenant: ${tenantSlug || 'none'}`);

// Include tenantSlug in the request if provided
const payload = tenantSlug
? { email, password, tenantSlug }
: { email, password };

const response = await apiClient.post('/auth/login', payload);

if (!response.data || !response.data.data) {
throw new Error('No data returned from login');
}

const { user, token } = response.data.data;

// Store token
localStorage.setItem('auth_token', token);

// Store user data in localStorage with the same structure as Supabase
const userData = {
id: user._id,
name: user.name || email.split('@')[0],
email: user.email || email,
role: user.role || USER_ROLES.STUDENT,
last_login: new Date().toISOString(),
tenant_id: user.tenant_id,
tenant_slug: user.tenant_slug || tenantSlug, // Store the tenant slug
school_id: user.school_id,
profile_image: user.profile_image
};

// Store tenant slug in localStorage if it exists
if (user.tenant_slug || tenantSlug) {
localStorage.setItem('tenantSlug', user.tenant_slug || tenantSlug);
}

localStorage.setItem('auth_user', JSON.stringify(userData));

return { user: userData, token };
} catch (error) {
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
} catch (error) {
console.error('MongoDB registration error:', error);
throw error.response?.data?.message || error.message || 'Registration failed';
}
};

// Logout
export const logout = () => {
localStorage.removeItem('tenantSlug');
localStorage.removeItem('tenantId');
localStorage.clear();
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
console.log("Creating test users with MongoDB");

// Create test users (admin, teacher, student, etc.)
const response = await apiClient.post('/auth/create-test-users', {
tenantId: 'default',
schoolId: 'default'
});

console.log('Test users created successfully:', response.data);

// Format the response to match the expected interface
if (response.data && response.data.success) {
const users = response.data.data.map((user: any) => ({
name: user.name,
email: user.email,
role: user.role,
password: 'Password123!', // Default password for all test users
status: user.status,
message: user.message || ''
}));

return users;
}

throw new Error('Failed to create test users');
} catch (error) {
console.error('Error creating test users:', error);

// Return default users as fallback
return [
{ name: "Super Admin", email: "superadmin@campuscore.edu", role: "super_admin", password: "Password123!", status: "Default" },
{ name: "School Admin", email: "schooladmin@campuscore.edu", role: "school_admin", password: "Password123!", status: "Default" },
{ name: "Teacher", email: "teacher@campuscore.edu", role: "teacher", password: "Password123!", status: "Default" },
{ name: "Student", email: "student@campuscore.edu", role: "student", password: "Password123!", status: "Default" },
{ name: "Parent", email: "parent@campuscore.edu", role: "parent", password: "Password123!", status: "Default" },
{ name: "Accountant", email: "accountant@campuscore.edu", role: "accountant", password: "Password123!", status: "Default" },
{ name: "Librarian", email: "librarian@campuscore.edu", role: "librarian", password: "Password123!", status: "Default" },
{ name: "Receptionist", email: "receptionist@campuscore.edu", role: "receptionist", password: "Password123!", status: "Default" },
{ name: "Transport Manager", email: "transport@campuscore.edu", role: "transport_manager", password: "Password123!", status: "Default" }
];
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
// Convert frontend StudentFormData to MongoDB format
const mongoStudent = {
first_name: studentData.first_name,
middle_name: studentData.middle_name || '',
last_name: studentData.last_name,
gender: studentData.gender,
date_of_birth: studentData.date_of_birth,
email: studentData.email,
phone: studentData.phone,
address: {
street: studentData.address,
city: studentData.city,
state: studentData.state,
country: studentData.country || 'India',
pincode: studentData.pincode
},
admission_number: studentData.admission_number,
roll_number: studentData.roll_number,
admission_date: studentData.admission_date,
school_id: studentData.school_id,
class_id: studentData.class_id,
section: studentData.section,
academic_year: studentData.academic_year,
status: studentData.status || 'active',
tenant_id: getCurrentTenantId()
};

const response = await authClient.post('/students', mongoStudent);
return response.data.data;
} catch (error) {
console.error('Error creating student:', error);
throw error;
}
};

export const updateStudent = async (id: string, studentData: Partial<any>) => {
try {
// Convert frontend StudentFormData to MongoDB format
const mongoStudent: any = {};

// Only include fields that are present in the update data
if (studentData.first_name) mongoStudent.first_name = studentData.first_name;
if (studentData.middle_name !== undefined) mongoStudent.middle_name = studentData.middle_name;
if (studentData.last_name) mongoStudent.last_name = studentData.last_name;
if (studentData.gender) mongoStudent.gender = studentData.gender;
if (studentData.date_of_birth) mongoStudent.date_of_birth = studentData.date_of_birth;
if (studentData.email) mongoStudent.email = studentData.email;
if (studentData.phone) mongoStudent.phone = studentData.phone;

// Address fields
if (studentData.address || studentData.city || studentData.state || studentData.country || studentData.pincode) {
mongoStudent.address = {};
if (studentData.address) mongoStudent.address.street = studentData.address;
if (studentData.city) mongoStudent.address.city = studentData.city;
if (studentData.state) mongoStudent.address.state = studentData.state;
if (studentData.country) mongoStudent.address.country = studentData.country;
if (studentData.pincode) mongoStudent.address.pincode = studentData.pincode;
}

if (studentData.admission_number) mongoStudent.admission_number = studentData.admission_number;
if (studentData.roll_number) mongoStudent.roll_number = studentData.roll_number;
if (studentData.admission_date) mongoStudent.admission_date = studentData.admission_date;
if (studentData.school_id) mongoStudent.school_id = studentData.school_id;
if (studentData.class_id) mongoStudent.class_id = studentData.class_id;
if (studentData.section) mongoStudent.section = studentData.section;
if (studentData.academic_year) mongoStudent.academic_year = studentData.academic_year;
if (studentData.status) mongoStudent.status = studentData.status;

const response = await authClient.put(`/students/${id}`, mongoStudent);
return response.data.data;
} catch (error) {
console.error('Error updating student:', error);
throw error;
}
};

export const deleteStudent = async (id: string) => {
try {
const response = await authClient.delete(`/students/${id}`);
return response.data;
} catch (error) {
console.error('Error deleting student:', error);
throw error;
}
};

export const getStudents = async (options: {
page?: number;
limit?: number;
schoolId?: string;
classId?: string;
section?: string;
status?: string;
search?: string;
sortBy?: string;
sortOrder?: 'asc' | 'desc';
}) => {
try {
const {
page = 1,
limit = 10,
schoolId,
classId,
section,
status,
search,
sortBy = 'created_at',
sortOrder = 'desc'
} = options;

// Build query parameters
const params = new URLSearchParams();
params.append('page', page.toString());
params.append('limit', limit.toString());
if (schoolId) params.append('school_id', schoolId);
if (classId) params.append('class_id', classId);
if (section) params.append('section', section);
if (status) params.append('status', status);
if (search) params.append('search', search);
params.append('sortBy', sortBy);
params.append('sortOrder', sortOrder);

const response = await authClient.get(`/students?${params.toString()}`);

// Map MongoDB response to match Supabase format
const students = response.data.data.map((student: any) => ({
id: student._id,
first_name: student.first_name,
middle_name: student.middle_name,
last_name: student.last_name,
full_name: `${student.first_name} ${student.last_name}`,
email: student.email,
gender: student.gender,
roll_number: student.roll_number,
admission_number: student.admission_number,
class_id: student.class_id,
school_id: student.school_id,
section: student.section,
status: student.status,
created_at: student.created_at,
// Include other fields as needed
}));

return {
data: students,
pagination: response.data.pagination
};
} catch (error) {
console.error('Error fetching students:', error);
throw error;
}
};

export const getStudentById = async (id: string) => {
try {
const response = await authClient.get(`/students/${id}`);
const student = response.data.data;

// Map MongoDB response to match Supabase format
return {
id: student._id,
first_name: student.first_name,
middle_name: student.middle_name,
last_name: student.last_name,
full_name: `${student.first_name} ${student.last_name}`,
email: student.email,
gender: student.gender,
date_of_birth: student.date_of_birth,
roll_number: student.roll_number,
admission_number: student.admission_number,
admission_date: student.admission_date,
class_id: student.class_id,
school_id: student.school_id,
section: student.section,
address: student.address.street,
city: student.address.city,
state: student.address.state,
country: student.address.country,
pincode: student.address.pincode,
phone: student.phone,
status: student.status,
created_at: student.created_at,
academic_year: student.academic_year,
// Include other fields as needed
};
} catch (error) {
console.error('Error fetching student:', error);
throw error;
}
};

// Get current tenant ID from local storage
const getCurrentTenantId = () => {
const user = JSON.parse(localStorage.getItem('auth_user') || '{}');
return user.tenant_id || 'default';
};

// School related functions
export const getSchools = async () => {
try {
const response = await authClient.get('/schools');
return response.data.data;
} catch (error) {
console.error('Error fetching schools:', error);
throw error;
}
};

export const getSchoolById = async (id: string) => {
try {
const response = await authClient.get(`/schools/${id}`);
return response.data.data;
} catch (error) {
console.error('Error fetching school:', error);
throw error;
}
};

// Class related functions
export const getClasses = async (schoolId?: string) => {
try {
const params = new URLSearchParams();
if (schoolId) params.append('school_id', schoolId);

const response = await authClient.get(`/classes?${params.toString()}`);
return response.data.data;
} catch (error) {
console.error('Error fetching classes:', error);
throw error;
}
};

export const getClassById = async (id: string) => {
try {
const response = await authClient.get(`/classes/${id}`);
return response.data.data;
} catch (error) {
console.error('Error fetching class:', error);
throw error;
}
};

// User management functions
export const createUser = async (userData: any) => {
  try {
    const response = await authClient.post('/users', userData);
    return response.data.data;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};

export const updateUser = async (id: string, userData: any) => {
  try {
    const response = await authClient.put(`/users/${id}`, userData);
    return response.data.data;
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await authClient.delete(`/users/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};

export const getUsers = async (options: {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}) => {
  try {
    const {
      page = 1,
      limit = 10,
      role,
      search,
      sortBy = 'created_at',
      sortOrder = 'desc'
    } = options;

    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('limit', limit.toString());
    if (role) params.append('role', role);
    if (search) params.append('search', search);
    params.append('sortBy', sortBy);
    params.append('sortOrder', sortOrder);

    const response = await authClient.get(`/users?${params.toString()}`);

    const users = response.data.data.map((user: any) => ({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profile_image: user.profile_image,
      school_id: user.school_id,
      class_id: user.class_id,
      section: user.section,
      parent_links: user.parent_links,
      student_links: user.student_links,
      account_status: user.account_status || 'active',
      created_at: user.created_at,
      updated_at: user.updated_at,
    }));

    return {
      data: users,
      pagination: response.data.pagination
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getUserById = async (id: string) => {
  try {
    const response = await authClient.get(`/users/${id}`);
    const user = response.data.data;

    return {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      profile_image: user.profile_image,
      school_id: user.school_id,
      class_id: user.class_id,
      section: user.section,
      parent_links: user.parent_links,
      student_links: user.student_links,
      account_status: user.account_status || 'active',
      created_at: user.created_at,
      updated_at: user.updated_at,
    };
  } catch (error) {
    console.error('Error fetching user:', error);
    throw error;
  }
};

// Link students to parents
export const linkStudentToParent = async (studentId: string, parentId: string, relationship: string) => {
  try {
    const response = await authClient.post('/users/link-parent', {
      student_id: studentId,
      parent_id: parentId,
      relationship,
    });
    return response.data;
  } catch (error) {
    console.error('Error linking student to parent:', error);
    throw error;
  }
};

// Unlink students from parents
export const unlinkStudentFromParent = async (studentId: string, parentId: string) => {
  try {
    const response = await authClient.delete(`/users/unlink-parent/${studentId}/${parentId}`);
    return response.data;
  } catch (error) {
    console.error('Error unlinking student from parent:', error);
    throw error;
  }
};

// Update the mongodbService export to include new functions
export const mongodbService = {
login,
register,
logout,
getUserProfile,
createTestUsers,
isMongoDBConfigured,
createStudent,
updateStudent,
deleteStudent,
getStudents,
getStudentById,
getSchools,
getSchoolById,
getClasses,
getClassById,
  createUser,
  updateUser,
  deleteUser,
  getUsers,
  getUserById,
  linkStudentToParent,
  unlinkStudentFromParent,
};

export default mongodbService;
