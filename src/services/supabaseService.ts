
// This file is maintained for backward compatibility.
// Please import from '@/lib/services' instead.
import { supabaseService, USER_ROLES } from '@/lib/services';
import { MinimalStudent } from '@/types/student';
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseAvailability } from '@/lib/services/supabase/utils';

// Special function to create test users using Supabase Auth API
export const createTestUsers = async () => {
  console.log("Creating test users via compatibility layer");
  return await supabaseService.createTestUsers();
};

// Override getStudents method to avoid deep type instantiation
export const getStudents = async (schoolId?: string): Promise<MinimalStudent[]> => {
  try {
    checkSupabaseAvailability();
    
    let query = supabase.from('students').select('*');
    
    if (schoolId) {
      // Use type assertion to avoid deep type instantiation
      (query as any) = (query as any).eq('school_id', schoolId);
    }
    
    const { data, error } = await query;

    if (error) throw error;
    
    // Cast safely to avoid deep type instantiation
    return (data || []).map((student: any) => ({
      _id: student.id || '',
      id: student.id,
      name: student.name || '',
      email: student.email || '',
      rollNumber: student.roll_number || '',
      roll_number: student.roll_number || '',
      department: student.department || '',
      status: student.status || 'active'
    }));
  } catch (error) {
    console.error('Get students error:', error);
    throw error;
  }
};

export { USER_ROLES };
// Export updated service with overridden methods
export default {
  ...supabaseService,
  getStudents
} as unknown as {
  getStudents(): Promise<MinimalStudent[]>;
  [key: string]: any;
};
