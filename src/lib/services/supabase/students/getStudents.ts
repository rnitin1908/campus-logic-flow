
import { supabase } from '@/integrations/supabase/client';
import { Student } from '@/types/student';
import { checkSupabaseAvailability } from '../utils';
import { convertToDbStudent, mapDatabaseToStudent } from './mappers';

export const getStudents = async (schoolId?: string): Promise<Student[]> => {
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
