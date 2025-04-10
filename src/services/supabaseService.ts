
// This file is maintained for backward compatibility.
// Please import from '@/lib/services' instead.
import { supabaseService, USER_ROLES } from '@/lib/services';
import { MinimalStudent } from '@/types/student';

// Special function to create test users using Supabase Auth API
export const createTestUsers = async () => {
  console.log("Creating test users via compatibility layer");
  return await supabaseService.createTestUsers();
};

export { USER_ROLES };
// Export service as MinimalStudent type to avoid deep type instantiation
export default supabaseService as unknown as {
  getStudents(): Promise<MinimalStudent[]>;
  [key: string]: any;
};
