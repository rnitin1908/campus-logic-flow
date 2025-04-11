
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseAvailability } from '../utils';

export interface AcademicTerm {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  school_id?: string;
  is_current: boolean;
  created_at?: string;
  updated_at?: string;
}

export const getAcademicTerms = async (schoolId?: string): Promise<AcademicTerm[]> => {
  try {
    checkSupabaseAvailability();
    
    let query = supabase.from('academic_terms').select('*');
    
    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }
    
    // Order by start date, most recent first
    query = query.order('start_date', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as AcademicTerm[] || [];
  } catch (error) {
    console.error('Get academic terms error:', error);
    throw error;
  }
};

export const getCurrentTerm = async (schoolId?: string): Promise<AcademicTerm | null> => {
  try {
    checkSupabaseAvailability();
    
    let query = supabase.from('academic_terms')
      .select('*')
      .eq('is_current', true);
    
    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data && data.length > 0 ? data[0] as AcademicTerm : null;
  } catch (error) {
    console.error('Get current term error:', error);
    return null;
  }
};

export const createAcademicTerm = async (term: Omit<AcademicTerm, 'id' | 'created_at' | 'updated_at'>): Promise<AcademicTerm> => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await (supabase
      .from('academic_terms') as any)
      .insert(term)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as AcademicTerm;
  } catch (error) {
    console.error('Create academic term error:', error);
    throw error;
  }
};

export const updateAcademicTerm = async (id: string, updates: Partial<AcademicTerm>): Promise<void> => {
  try {
    checkSupabaseAvailability();
    
    const { error } = await (supabase
      .from('academic_terms') as any)
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Update academic term error:', error);
    throw error;
  }
};
