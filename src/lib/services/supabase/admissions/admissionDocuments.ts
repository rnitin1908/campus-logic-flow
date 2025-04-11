
import { supabase } from '@/integrations/supabase/client';
import { AdmissionDocument } from '@/types/admission';
import { checkSupabaseAvailability } from '../utils';

export const uploadAdmissionDocument = async (
  admissionId: string,
  file: File,
  type: string
): Promise<AdmissionDocument> => {
  try {
    checkSupabaseAvailability();
    
    // Upload file to Supabase Storage
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `admission_documents/${admissionId}/${fileName}`;
    
    const { error: uploadError } = await supabase.storage
      .from('documents')
      .upload(filePath, file);
    
    if (uploadError) throw uploadError;
    
    // Get the public URL
    const { data: urlData } = supabase.storage
      .from('documents')
      .getPublicUrl(filePath);
    
    if (!urlData.publicUrl) throw new Error("Couldn't get public URL for uploaded file");
    
    // Add document record to the database
    // Use type assertion to bypass TS type checking
    const { data, error } = await (supabase
      .from('admission_documents') as any)
      .insert({
        admission_id: admissionId,
        type,
        name: file.name,
        url: urlData.publicUrl
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data as unknown as AdmissionDocument;
  } catch (error) {
    console.error('Upload admission document error:', error);
    throw error;
  }
};
