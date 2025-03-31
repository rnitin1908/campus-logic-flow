import { createClient } from '@supabase/supabase-js';
import { Student, StudentFormData } from '@/types/student';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase URL or key. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY');
}

const supabase = createClient(supabaseUrl, supabaseKey);

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

export const supabaseService = {
  // Auth methods
  login: async (email: string, password: string) => {
    try {
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
          .single();

        // Store user data in localStorage
        const userData = {
          id: data.user.id,
          name: profileData?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email,
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
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create a profile record in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: data.user.id, 
              name, 
              email,
              role,
              school_id: schoolId
            }
          ]);

        if (profileError) throw profileError;
        
        return { success: true, message: 'User registered successfully' };
      }
      
      throw new Error('Registration failed');
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  logout: async () => {
    await supabase.auth.signOut();
    localStorage.removeItem('user');
  },

  // Role-based access control helpers
  hasPermission: (requiredRoles: string[]) => {
    const user = supabaseService.getCurrentUser();
    if (!user) return false;
    return requiredRoles.includes(user.role);
  },

  // Student methods
  getStudents: async (schoolId?: string): Promise<Student[]> => {
    try {
      let query = supabase.from('students').select('*');
      
      // Filter by school if a school ID is provided
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Get students error:', error);
      throw error;
    }
  },

  getStudentById: async (id: string): Promise<Student> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Get student error:', error);
      throw error;
    }
  },

  createStudent: async (studentData: StudentFormData): Promise<Student> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert([studentData])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Create student error:', error);
      throw error;
    }
  },

  updateStudent: async (id: string, studentData: Partial<Student>): Promise<Student> => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(studentData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
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
      const { data, error } = await supabase
        .from('students')
        .insert(students);

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

  // Create the necessary tables and RLS policies
  setupDatabase: async () => {
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
