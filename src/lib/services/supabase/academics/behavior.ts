
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseAvailability } from '../utils';

export interface BehaviorRecord {
  id: string;
  student_id: string;
  incident_date: string;
  category: string;
  description: string;
  severity: string;
  action_taken?: string;
  reported_by?: string;
  created_at?: string;
  updated_at?: string;
  // Joined fields
  reporter?: {
    name: string;
    position: string;
  }
}

export const BEHAVIOR_CATEGORIES = [
  'Academic Misconduct',
  'Bullying',
  'Classroom Disruption',
  'Dress Code Violation',
  'Fighting',
  'Late Arrival',
  'Positive Behavior',
  'Recognition',
  'Technology Misuse',
  'Truancy',
  'Vandalism',
  'Other'
];

export const SEVERITY_LEVELS = [
  'Minor',
  'Moderate',
  'Major',
  'Critical',
  'Positive'
];

export const getStudentBehaviorRecords = async (studentId: string, limit?: number): Promise<BehaviorRecord[]> => {
  try {
    checkSupabaseAvailability();
    
    let query = (supabase
      .from('behavior_records') as any)
      .select(`
        *,
        reporter:staff!reported_by(name, position)
      `)
      .eq('student_id', studentId)
      .order('incident_date', { ascending: false });
    
    if (limit) {
      query = query.limit(limit);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data as BehaviorRecord[] || [];
  } catch (error) {
    console.error('Get student behavior records error:', error);
    throw error;
  }
};

export const createBehaviorRecord = async (record: Omit<BehaviorRecord, 'id' | 'created_at' | 'updated_at'>): Promise<BehaviorRecord> => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await (supabase
      .from('behavior_records') as any)
      .insert(record)
      .select()
      .single();
    
    if (error) throw error;
    
    return data as BehaviorRecord;
  } catch (error) {
    console.error('Create behavior record error:', error);
    throw error;
  }
};

export const updateBehaviorRecord = async (id: string, updates: Partial<BehaviorRecord>): Promise<void> => {
  try {
    checkSupabaseAvailability();
    
    const { error } = await (supabase
      .from('behavior_records') as any)
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Update behavior record error:', error);
    throw error;
  }
};

export const deleteBehaviorRecord = async (id: string): Promise<void> => {
  try {
    checkSupabaseAvailability();
    
    const { error } = await (supabase
      .from('behavior_records') as any)
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Delete behavior record error:', error);
    throw error;
  }
};
