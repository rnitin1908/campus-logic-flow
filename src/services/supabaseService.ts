
// This file is maintained for backward compatibility.
// Please import from '@/lib/services' instead.
import { supabaseService, USER_ROLES } from '@/lib/services';

// Special function to create test users using Supabase Auth API
export const createTestUsers = async () => {
  console.log("Creating test users via compatibility layer");
  return await supabaseService.createTestUsers();
};

export { USER_ROLES };
export default supabaseService;
