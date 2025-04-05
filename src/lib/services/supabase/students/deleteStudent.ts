
import { supabase } from '@/integrations/supabase/client';

export const deleteStudent = async (id: string) => {
  try {
    const { error } = await supabase
      .from('students')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return { success: true, message: 'Student deleted successfully' };
  } catch (error) {
    console.error('Delete student error:', error);
    throw error;
  }
};
