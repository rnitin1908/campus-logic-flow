
import { supabase } from '@/integrations/supabase/client';
import { Student, StudentFormData } from '@/types/student';
import { convertToDbStudent, mapDatabaseToStudent, convertFormToSupabaseStudent } from './mappers';

export const createStudent = async (studentData: StudentFormData): Promise<Student | null> => {
  try {
    // Convert StudentFormData to Supabase format
    const supabaseStudentData = convertFormToSupabaseStudent(studentData);
    
    const { data, error } = await supabase
      .from('students')
      .insert(supabaseStudentData)
      .select()
      .single();

    if (error) throw error;
    
    const dbStudent = convertToDbStudent(data);
    return mapDatabaseToStudent(dbStudent);
  } catch (error) {
    console.error('Create student error:', error);
    throw error;
  }
};

// Import multiple students at once
export const importStudents = async (students: StudentFormData[]): Promise<{ success: boolean, count: number }> => {
  try {
    // Convert each student to Supabase format
    const supabaseStudents = students.map(student => convertFormToSupabaseStudent(student));
    
    const { error } = await supabase
      .from('students')
      .insert(supabaseStudents);

    if (error) throw error;
    return { success: true, count: students.length };
  } catch (error) {
    console.error('Import students error:', error);
    throw error;
  }
};
