
import { supabase } from '@/integrations/supabase/client';

export const checkSupabaseAvailability = () => {
  if (!supabase) {
    throw new Error('Supabase client is not available');
  }
  return true;
};
