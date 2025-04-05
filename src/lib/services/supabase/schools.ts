
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseAvailability } from './utils';

export const getSchools = async () => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await supabase
      .from('schools')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get schools error:', error);
    throw error;
  }
};

export const getSchoolById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get school error:', error);
    throw error;
  }
};

export const createSchool = async (schoolData: any) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .insert([schoolData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create school error:', error);
    throw error;
  }
};

export const updateSchool = async (id: string, schoolData: any) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .update(schoolData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update school error:', error);
    throw error;
  }
};

export const deleteSchool = async (id: string) => {
  try {
    const { error } = await supabase
      .from('schools')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, message: 'School deleted successfully' };
  } catch (error) {
    console.error('Delete school error:', error);
    throw error;
  }
};
