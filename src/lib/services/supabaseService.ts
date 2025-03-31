
import { supabase } from '@/integrations/supabase/client';
import { Student, StudentFormData, convertToSupabaseStudent, convertToMongoDBStudent, GenderType, StatusType } from '@/types/student';

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

// Helper function to check if Supabase is available
const checkSupabaseAvailability = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized properly.');
  }
};

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
      checkSupabaseAvailability();
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create a profile record in the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id, 
            name, 
            email,
            role: role as any, // Cast to any to handle the type validation
            school_id: schoolId
          });

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
      checkSupabaseAvailability();
      
      let query = supabase.from('students').select('*');
      
      // Filter by school if a school ID is provided
      if (schoolId) {
        query = query.eq('school_id', schoolId);
      }
      
      const { data, error } = await query;

      if (error) throw error;
      
      // Convert Supabase students to MongoDB format
      return data?.map(student => convertToMongoDBStudent(student)) || [];
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
      
      return convertToMongoDBStudent(data);
    } catch (error) {
      console.error('Get student error:', error);
      throw error;
    }
  },

  createStudent: async (studentData: StudentFormData): Promise<Student> => {
    try {
      // Convert StudentFormData to Supabase format
      const supabaseStudentData = convertToSupabaseStudent(studentData);
      
      const { data, error } = await supabase
        .from('students')
        .insert(supabaseStudentData)
        .select()
        .single();

      if (error) throw error;
      
      return convertToMongoDBStudent(data);
    } catch (error) {
      console.error('Create student error:', error);
      throw error;
    }
  },

  updateStudent: async (id: string, studentData: Partial<Student>): Promise<Student> => {
    try {
      // Convert partial Student to Supabase format
      const updateData: any = {};
      
      if (studentData.name) updateData.name = studentData.name;
      if (studentData.email) updateData.email = studentData.email;
      if (studentData.rollNumber) updateData.roll_number = studentData.rollNumber;
      if (studentData.department) updateData.department = studentData.department;
      if (studentData.status) updateData.status = studentData.status as StatusType;
      if (studentData.dateOfBirth) updateData.date_of_birth = studentData.dateOfBirth;
      if (studentData.gender) updateData.gender = studentData.gender as GenderType;
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
      
      return convertToMongoDBStudent(data);
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
