
import { supabase } from '@/integrations/supabase/client';
import { Student, MinimalStudent } from '@/types/student';
import { mapSupabaseStudentToStudent } from './mappers';
import { checkSupabaseAvailability } from '../utils';

export const getStudents = async (schoolId?: string): Promise<Student[]> => {
  try {
    checkSupabaseAvailability();
    
    let query = supabase
      .from('students')
      .select('*');

    if (schoolId) {
      // Use as any to avoid deep instantiation error
      (query as any) = (query as any).eq('school_id', schoolId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map(mapSupabaseStudentToStudent);
  } catch (error) {
    console.error('Get students error:', error);
    throw error;
  }
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await supabase
      .from('students')
      .select(`
        *,
        parent_info(*),
        emergency_contacts(*),
        health_info(
            *,
            allergies(*),
            medical_conditions(*)
        ),
        documents(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data ? mapSupabaseStudentToStudent(data) : null;
  } catch (error) {
    console.error('Get student by id error:', error);
    return null;
  }
};

export const getStudentsForExport = async (schoolId?: string): Promise<MinimalStudent[]> => {
  try {
    checkSupabaseAvailability();
    
    let query = supabase
      .from('students')
      .select('id, name, email, roll_number, department, status');

    if (schoolId) {
      // Use as any to avoid deep instantiation error
      (query as any) = (query as any).eq('school_id', schoolId);
    }
    
    const { data, error } = await query;
    if (error) throw error;
    
    return (data || []).map((student: any) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      rollNumber: student.roll_number,
      department: student.department,
      status: student.status
    }));
  } catch (error) {
    console.error('Get students for export error:', error);
    throw error;
  }
};
