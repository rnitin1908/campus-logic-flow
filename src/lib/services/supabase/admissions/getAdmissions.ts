
import { supabase } from '@/integrations/supabase/client';
import { AdmissionRequest } from '@/types/admission';
import { checkSupabaseAvailability } from '../utils';

export const getAdmissionRequests = async (
  parentId?: string, 
  schoolId?: string, 
  status?: string
): Promise<AdmissionRequest[]> => {
  try {
    checkSupabaseAvailability();
    
    let query = supabase.from('admission_requests').select(`
      *,
      documents:admission_documents(*)
    `);
    
    // Filter by parent if parentId is provided
    if (parentId) {
      query = query.eq('parent_id', parentId);
    }
    
    // Filter by school if schoolId is provided
    if (schoolId) {
      query = query.eq('school_id', schoolId);
    }
    
    // Filter by status if provided
    if (status) {
      query = query.eq('status', status);
    }
    
    // Order by creation date, newest first
    query = query.order('created_at', { ascending: false });
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return (data || []) as AdmissionRequest[];
  } catch (error) {
    console.error('Get admission requests error:', error);
    throw error;
  }
};

export const getAdmissionRequestById = async (id: string): Promise<AdmissionRequest | null> => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await supabase
      .from('admission_requests')
      .select(`
        *,
        documents:admission_documents(*)
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    
    return data as AdmissionRequest;
  } catch (error) {
    console.error('Get admission request by id error:', error);
    return null;
  }
};
