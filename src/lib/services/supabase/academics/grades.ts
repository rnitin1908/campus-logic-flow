
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseAvailability } from '../utils';
import { Subject } from './subjects';
import { AcademicTerm } from './terms';

export interface Grade {
  id: string;
  student_id: string;
  subject_id: string;
  term_id: string;
  score?: number;
  letter_grade?: string;
  comments?: string;
  teacher_id?: string;
  created_at?: string;
  updated_at?: string;
  // Joined data
  subject?: Subject;
  term?: AcademicTerm;
  teacher_name?: string;
}

export const getStudentGrades = async (studentId: string, termId?: string): Promise<Grade[]> => {
  try {
    checkSupabaseAvailability();
    
    let query = (supabase
      .from('grades') as any)
      .select(`
        *,
        subject:subjects(*),
        term:academic_terms(*)
      `)
      .eq('student_id', studentId);
    
    if (termId) {
      query = query.eq('term_id', termId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []).map((grade: any) => ({
      ...grade,
      subject: grade.subject,
      term: grade.term,
      teacher_name: grade.teacher_name
    })) as Grade[];
  } catch (error) {
    console.error('Get student grades error:', error);
    throw error;
  }
};

export const getClassGrades = async (subjectId: string, termId: string): Promise<Grade[]> => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await (supabase
      .from('grades') as any)
      .select('*')
      .eq('subject_id', subjectId)
      .eq('term_id', termId);
    
    if (error) throw error;
    
    return data as Grade[] || [];
  } catch (error) {
    console.error('Get class grades error:', error);
    throw error;
  }
};

export const createGrade = async (grade: Omit<Grade, 'id' | 'created_at' | 'updated_at'>): Promise<Grade> => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await (supabase
      .from('grades') as any)
      .insert(grade)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Grade;
  } catch (error) {
    console.error('Create grade error:', error);
    throw error;
  }
};

export const updateGrade = async (id: string, updates: Partial<Grade>): Promise<void> => {
  try {
    checkSupabaseAvailability();
    
    const { error } = await (supabase
      .from('grades') as any)
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Update grade error:', error);
    throw error;
  }
};

export const deleteGrade = async (id: string): Promise<void> => {
  try {
    checkSupabaseAvailability();
    
    const { error } = await (supabase
      .from('grades') as any)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Delete grade error:', error);
    throw error;
  }
};
