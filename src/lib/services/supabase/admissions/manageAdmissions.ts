
import { supabase } from '@/integrations/supabase/client';
import { AdmissionRequest, AdmissionRequestFormData, AdmissionStatus } from '@/types/admission';
import { checkSupabaseAvailability } from '../utils';

export const createAdmissionRequest = async (
  formData: AdmissionRequestFormData,
  parentId: string
): Promise<AdmissionRequest> => {
  try {
    checkSupabaseAvailability();
    
    // Use type assertion to bypass TS type checking
    const { data, error } = await (supabase
      .from('admission_requests') as any)
      .insert({
        parent_id: parentId,
        student_name: formData.student_name,
        date_of_birth: formData.date_of_birth,
        gender: formData.gender,
        address: formData.address,
        contact_number: formData.contact_number,
        email: formData.email,
        previous_school: formData.previous_school,
        grade_applying_for: formData.grade_applying_for,
        academic_year: formData.academic_year,
        school_id: formData.school_id,
        notes: formData.notes,
        status: 'pending' // Default status
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as unknown as AdmissionRequest;
  } catch (error) {
    console.error('Create admission request error:', error);
    throw error;
  }
};

export const updateAdmissionStatus = async (
  id: string,
  status: AdmissionStatus,
  notes?: string
): Promise<void> => {
  try {
    checkSupabaseAvailability();
    
    // Create update object
    const updateData: any = { status };
    
    if (notes !== undefined) {
      updateData.notes = notes;
    }
    
    // Use type assertion to bypass TS type checking
    const { error } = await (supabase
      .from('admission_requests') as any)
      .update(updateData)
      .eq('id', id);
    
    if (error) throw error;
  } catch (error) {
    console.error('Update admission status error:', error);
    throw error;
  }
};
