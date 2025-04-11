
import { supabase } from '@/integrations/supabase/client';
import { Student, MinimalStudent } from '@/types/student';
import { checkSupabaseAvailability } from '../utils';
import { convertToDbStudent, mapDatabaseToStudent } from './mappers';

export const getStudents = async (schoolId?: string): Promise<MinimalStudent[]> => {
  try {
    checkSupabaseAvailability();
    
    // Use direct query formation without excessive type assertions
    let query = supabase.from('students');
    
    // Filter by school if a school ID is provided
    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }
    
    // Execute query
    const { data, error } = await query.select('*');

    if (error) throw error;
    
    // Convert Supabase students to application format
    const students: MinimalStudent[] = [];
    
    if (data) {
      for (const student of data) {
        // Use a direct type conversion for database records
        const dbStudent = convertToDbStudent(student);
        const convertedStudent = mapDatabaseToStudent(dbStudent);
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
};

export const getStudentById = async (id: string): Promise<Student | null> => {
  try {
    // Use direct query formation without excessive type assertions
    const { data, error } = await supabase
      .from('students')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    
    if (!data) return null;
    
    const dbStudent = convertToDbStudent(data);
    return mapDatabaseToStudent(dbStudent);
  } catch (error) {
    console.error('Get student error:', error);
    throw error;
  }
};
