
import { supabase } from '@/integrations/supabase/client';
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

// Helper function to check if Supabase is available
export const checkSupabaseAvailability = () => {
  if (!supabase) {
    throw new Error('Supabase client is not initialized properly.');
  }
};

// Helper function to validate user role
export function validateUserRole(role: string): UserRoleType {
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

// Utility functions for general use
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const isSupabaseConfigured = () => {
  return !!supabase;
};

export const setupDatabase = async () => {
  checkSupabaseAvailability();
  
  const user = getCurrentUser();
  if (!user || user.role !== USER_ROLES.SUPER_ADMIN) {
    throw new Error('Only super admins can set up the database');
  }

  // This is a placeholder function - in reality, you would write SQL migrations
  // or use Supabase's dashboard to set up tables and policies
  console.log('Setting up database...');
  return { success: true, message: 'Database setup initiated' };
};
