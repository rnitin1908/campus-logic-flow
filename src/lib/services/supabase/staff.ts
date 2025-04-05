
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseAvailability } from './utils';

export const getStaff = async () => {
  try {
    checkSupabaseAvailability();
    
    const { data, error } = await supabase
      .from('staff')
      .select('*');

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Get staff error:', error);
    throw error;
  }
};

export const getStaffById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Get staff error:', error);
    throw error;
  }
};

export const createStaff = async (staffData: any) => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .insert([staffData])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Create staff error:', error);
    throw error;
  }
};

export const updateStaff = async (id: string, staffData: any) => {
  try {
    const { data, error } = await supabase
      .from('staff')
      .update(staffData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Update staff error:', error);
    throw error;
  }
};

export const deleteStaff = async (id: string) => {
  try {
    const { error } = await supabase
      .from('staff')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, message: 'Staff deleted successfully' };
  } catch (error) {
    console.error('Delete staff error:', error);
    throw error;
  }
};
