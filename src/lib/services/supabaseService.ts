import { supabase } from '@/integrations/supabase/client';
import { Student, StudentFormData, convertToSupabaseStudent, GenderType, StatusType } from '@/types/student';
import { Database } from '@/integrations/supabase/types';

// Define allowed user roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'school_admin',
  TEACHER: 'teacher',
  STUDENT: 'student',
  PARENT: 'parent',
  ACCOUNTANT: 'accountant',
  LIBRARIAN: 'librarian',
  RECEPTIONIST: 'receptionist',
  TRANSPORT_MANAGER: 'transport_manager'
};

// Type for user roles that matches the Supabase enum
export type UserRoleType = Database['public']['Enums']['user_role'];

// Type for test user results
export interface TestUserResult {
  name: string;
  email: string;
  role: string;
  password: string;
  status: string;
  message?: string;
}

// Helper function to check if Supabase is available
const checkSupabaseAvailability = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized properly.');
  }
};

// Simple type for student from database that avoids circular references
interface DatabaseStudent {
  id: string;
  name: string;
  email: string;
  roll_number: string;
  department: string;
  status: string;
  date_of_birth?: string;
  gender?: string;
  contact_number?: string;
  address?: string;
  class?: string;
  section?: string;
  academic_year?: string;
  admission_date?: string;
  previous_school?: string;
  profile_id?: string;
  created_at?: string;
  updated_at?: string;
  enrollment_date?: string;
}

// Helper function to safely convert student data
function safeConvertToMongoDBStudent(dbStudent: DatabaseStudent | null): Student | null {
  if (!dbStudent) return null;
  
  return {
    _id: dbStudent.id || '',
    id: dbStudent.id,
    name: dbStudent.name || '',
    email: dbStudent.email || '',
    rollNumber: dbStudent.roll_number || '',
    roll_number: dbStudent.roll_number,
    department: dbStudent.department || '',
    status: dbStudent.status || 'active',
    dateOfBirth: dbStudent.date_of_birth,
    date_of_birth: dbStudent.date_of_birth,
    gender: dbStudent.gender,
    contactNumber: dbStudent.contact_number,
    contact_number: dbStudent.contact_number,
    address: dbStudent.address,
    admissionDate: dbStudent.admission_date,
    admission_date: dbStudent.admission_date,
    previousSchool: dbStudent.previous_school,
    previous_school: dbStudent.previous_school,
    class: dbStudent.class,
    section: dbStudent.section,
    academicYear: dbStudent.academic_year,
    academic_year: dbStudent.academic_year,
    profile_id: dbStudent.profile_id,
    created_at: dbStudent.created_at,
    updated_at: dbStudent.updated_at,
    enrollment_date: dbStudent.enrollment_date
  };
}

// Helper function to validate user role
function validateUserRole(role: string): UserRoleType {
  const validRoles: UserRoleType[] = [
    'super_admin',
    'school_admin',
    'teacher',
    'student',
    'parent',
    'accountant',
    'librarian',
    'receptionist',
    'transport_manager'
  ];
  
  if (validRoles.includes(role as UserRoleType)) {
    return role as UserRoleType;
  }
  
  // Default to 'student' if role is invalid
  console.warn(`Invalid role: ${role}. Defaulting to 'student'.`);
  return 'student';
}

export const supabaseService = {
  // Auth methods
  login: async (email: string, password: string) => {
    try {
      checkSupabaseAvailability();
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Get user profile data from the profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*, schools(name, id)')
          .eq('id', data.user.id)
          .maybeSingle();

        // Store user data in localStorage
        const userData = {
          id: data.user.id,
          name: profileData?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          role: profileData?.role || USER_ROLES.STUDENT,
          schoolId: profileData?.school_id || null,
          schoolName: profileData?.schools?.name || null,
          token: data.session?.access_token || '',
        };

        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
      
      throw new Error('Login failed');
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (name: string, email: string, password: string, role: string = USER_ROLES.STUDENT, schoolId: string | null = null) => {
    try {
      checkSupabaseAvailability();
      
      // Check if the user already exists
      const { data: existingUser } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', email)
        .maybeSingle();
        
      if (existingUser) {
        console.log('User already exists, skipping registration');
        return { success: true, message: 'User already exists', userId: existingUser.id };
      }
      
      // Register new user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Convert role string to a valid UserRoleType
        const userRole = validateUserRole(role);
        
        // Create a profile record in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id, 
            name, 
            email,
            role: userRole,
            school_id: schoolId
          });

        if (profileError) throw profileError;
        
        return { success: true, message: 'User registered successfully', userId: data.user.id };
      }
      
      throw new Error('Registration failed');
    } catch (error: any) {
      console.error('Registration error:', error);
      // If user already exists with this email, handle gracefully
      if (error.message?.includes('already registered')) {
        return { success: false, message: 'User with this email already exists', error };
      }
      throw error;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
  },

  // Create test users with different roles
  createTestUsers: async (): Promise<TestUserResult[]> => {
    try {
      checkSupabaseAvailability();
      
      // Default password for all test users
      const defaultPassword = "Password123!";
      
      // Define test users with different roles
      const testUsers = [
        { name: "Super Admin", email: "superadmin@campuscore.edu", role: USER_ROLES.SUPER_ADMIN },
        { name: "School Admin", email: "schooladmin@campuscore.edu", role: USER_ROLES.SCHOOL_ADMIN },
        { name: "Teacher", email: "teacher@campuscore.edu", role: USER_ROLES.TEACHER },
        { name: "Student", email: "student@campuscore.edu", role: USER_ROLES.STUDENT },
        { name: "Parent", email: "parent@campuscore.edu", role: USER_ROLES.PARENT },
        { name: "Accountant", email: "accountant@campuscore.edu", role: USER_ROLES.ACCOUNTANT },
        { name: "Librarian", email: "librarian@campuscore.edu", role: USER_ROLES.LIBRARIAN },
        { name: "Receptionist", email: "receptionist@campuscore.edu", role: USER_ROLES.RECEPTIONIST },
        { name: "Transport Manager", email: "transport@campuscore.edu", role: USER_ROLES.TRANSPORT_MANAGER }
      ];
      
      const results: TestUserResult[] = [];
      
      // Create each user
      for (const user of testUsers) {
        try {
          // Check if user exists in the auth system
          const { data: authData } = await supabase.auth.admin.listUsers({
            filter: {
              email: user.email
            }
          });
          
          const userExists = authData && authData.users && authData.users.length > 0;
          
          if (userExists) {
            results.push({ 
              ...user, 
              status: 'Exists', 
              password: defaultPassword,
              message: 'User already exists in auth system'
            });
            continue;
          }
          
          // Register new user with Supabase Auth + create profile
          const result = await supabaseService.register(
            user.name, 
            user.email, 
            defaultPassword, 
            user.role
          );
          
          if (result.success) {
            results.push({ 
              ...user, 
              status: 'Created', 
              password: defaultPassword,
              message: result.message
            });
          } else {
            results.push({ 
              ...user, 
              status: 'Error', 
              password: defaultPassword,
              message: result.message || 'Failed to create user'
            });
          }
        } catch (error: any) {
          console.error(`Error creating ${user.role} user:`, error);
          results.push({ 
            ...user, 
            status: 'Error', 
            password: defaultPassword,
            message: error.message || 'Unknown error'
          });
        }
      }
      
      return results;
    } catch (error) {
      console.error('Error creating test users:', error);
      throw error;
    }
  },

  // Student methods
  getStudents: async (schoolId?: string): Promise<Student[]> => {
    try {
      checkSupabaseAvailability();
      
      let query = supabase.from('students').select('*');
      
      // Filter by school if a school ID is provided
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      // Convert Supabase students to application format
      const students: Student[] = [];
      
      if (data) {
        for (const student of data) {
          // Use the intermediate interface to avoid circular references
          const dbStudent: DatabaseStudent = {
            id: student.id,
            name: student.name,
            email: student.email,
            roll_number: student.roll_number,
            department: student.department,
            status: student.status,
            date_of_birth: student.date_of_birth,
            gender: student.gender,
            contact_number: student.contact_number,
            address: student.address,
            class: student.class,
            section: student.section,
            academic_year: student.academic_year,
            admission_date: student.admission_date,
            previous_school: student.previous_school,
            profile_id: student.profile_id,
            created_at: student.created_at,
            updated_at: student.updated_at,
            enrollment_date: student.enrollment_date
          };
          
          const convertedStudent = safeConvertToMongoDBStudent(dbStudent);
          if (convertedStudent) {
            students.push(convertedStudent);
          }
        }
      }
      
      return students;
    } catch (error) {
      console.error('Get students error:', error);
      throw error;
    }
  },

  getStudentById: async (id: string): Promise<Student | null> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return safeConvertToMongoDBStudent(data);
    } catch (error) {
      console.error('Get student error:', error);
      throw error;
    }
  },

  createStudent: async (studentData: StudentFormData): Promise<Student | null> => {
    try {
      // Convert StudentFormData to Supabase format
      const supabaseStudentData = convertToSupabaseStudent(studentData);
      
      const { data, error } = await supabase
        .from('students')
        .insert(supabaseStudentData)
        .select()
        .single();

      if (error) throw error;
      
      return safeConvertToMongoDBStudent(data);
    } catch (error) {
      console.error('Create student error:', error);
      throw error;
    }
  },

  updateStudent: async (id: string, studentData: Partial<Student>): Promise<Student | null> => {
    try {
      // Convert partial Student to Supabase format
      const updateData: any = {};
      
      if (studentData.name) updateData.name = studentData.name;
      if (studentData.email) updateData.email = studentData.email;
      if (studentData.rollNumber) updateData.roll_number = studentData.rollNumber;
      if (studentData.department) updateData.department = studentData.department;
      if (studentData.status) updateData.status = studentData.status;
      if (studentData.dateOfBirth) updateData.date_of_birth = studentData.dateOfBirth;
      if (studentData.gender) updateData.gender = studentData.gender;
      if (studentData.contactNumber) updateData.contact_number = studentData.contactNumber;
      if (studentData.address) updateData.address = studentData.address;
      if (studentData.class) updateData.class = studentData.class;
      if (studentData.section) updateData.section = studentData.section;
      if (studentData.academicYear) updateData.academic_year = studentData.academicYear;
      if (studentData.admissionDate) updateData.admission_date = studentData.admissionDate;
      if (studentData.previousSchool) updateData.previous_school = studentData.previousSchool;
      
      const { data, error } = await supabase
        .from('students')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      return safeConvertToMongoDBStudent(data);
    } catch (error) {
      console.error('Update student error:', error);
      throw error;
    }
  },

  deleteStudent: async (id: string) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, message: 'Student deleted successfully' };
    } catch (error) {
      console.error('Delete student error:', error);
      throw error;
    }
  },

  // Import multiple students at once
  importStudents: async (students: StudentFormData[]): Promise<{ success: boolean, count: number }> => {
    try {
      // Convert each student to Supabase format
      const supabaseStudents = students.map(student => convertToSupabaseStudent(student));
      
      const { error } = await supabase
        .from('students')
        .insert(supabaseStudents);

      if (error) throw error;
      return { success: true, count: students.length };
    } catch (error) {
      console.error('Import students error:', error);
      throw error;
    }
  },

  // School methods
  getSchools: async () => {
    try {
      checkSupabaseAvailability();
      
      const { data, error } = await supabase
        .from('schools')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get schools error:', error);
      throw error;
    }
  },

  getSchoolById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get school error:', error);
      throw error;
    }
  },

  createSchool: async (schoolData: any) => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .insert([schoolData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create school error:', error);
      throw error;
    }
  },

  updateSchool: async (id: string, schoolData: any) => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .update(schoolData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update school error:', error);
      throw error;
    }
  },

  deleteSchool: async (id: string) => {
    try {
      const { error } = await supabase
        .from('schools')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, message: 'School deleted successfully' };
    } catch (error) {
      console.error('Delete school error:', error);
      throw error;
    }
  },

  // Staff methods
  getStaff: async () => {
    try {
      checkSupabaseAvailability();
      
      const { data, error } = await supabase
        .from('staff')
        .select('*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get staff error:', error);
      throw error;
    }
  },

  getStaffById: async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get staff error:', error);
      throw error;
    }
  },

  createStaff: async (staffData: any) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .insert([staffData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create staff error:', error);
      throw error;
    }
  },

  updateStaff: async (id: string, staffData: any) => {
    try {
      const { data, error } = await supabase
        .from('staff')
        .update(staffData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Update staff error:', error);
      throw error;
    }
  },

  deleteStaff: async (id: string) => {
    try {
      const { error } = await supabase
        .from('staff')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { success: true, message: 'Staff deleted successfully' };
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

  // Check if Supabase is configured
  isSupabaseConfigured: () => {
    return !!supabase;
  },

  // Create the necessary tables and RLS policies
  setupDatabase: async () => {
    checkSupabaseAvailability();
    
    const user = supabaseService.getCurrentUser();
    if (!user || user.role !== USER_ROLES.SUPER_ADMIN) {
      throw new Error('Only super admins can set up the database');
    }

    // This is a placeholder function - in reality, you would write SQL migrations
    // or use Supabase's dashboard to set up tables and policies
    console.log('Setting up database...');
    return { success: true, message: 'Database setup initiated' };
  }
};

export default supabaseService;
