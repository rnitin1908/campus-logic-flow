
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseAvailability } from '../utils';

export interface Subject {
  id: string;
  name: string;
  code: string;
  description?: string;
  department?: string;
  credits?: number;
  school_id?: string;
  created_at?: string;
  updated_at?: string;
}

export const getSubjects = async (schoolId?: string, department?: string): Promise<Subject[]> => {
  try {
    checkSupabaseAvailability();
    
    let query = supabase.from('subjects').select('*');
    
    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }
    
    if (department) {
      query = query.eq('department', department);
    }
    
    query = query.order('name');
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as Subject[] || [];
  } catch (error) {
    console.error('Get subjects error:', error);
    throw error;
  }
};

export const getSubjectById = async (id: string): Promise<Subject | null> => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await supabase
      .from('subjects')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as Subject;
  } catch (error) {
    console.error('Get subject by id error:', error);
    return null;
  }
};

export const createSubject = async (subject: Omit<Subject, 'id' | 'created_at' | 'updated_at'>): Promise<Subject> => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await (supabase
      .from('subjects') as any)
      .insert(subject)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as Subject;
  } catch (error) {
    console.error('Create subject error:', error);
    throw error;
  }
};

export const updateSubject = async (id: string, updates: Partial<Subject>): Promise<void> => {
  try {
    checkSupabaseAvailability();
    
    const { error } = await (supabase
      .from('subjects') as any)
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Update subject error:', error);
    throw error;
  }
};

export const deleteSubject = async (id: string): Promise<void> => {
  try {
    checkSupabaseAvailability();
    
    const { error } = await (supabase
      .from('subjects') as any)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Delete subject error:', error);
    throw error;
  }
};
