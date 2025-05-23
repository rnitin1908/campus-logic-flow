
// Re-export API service
export * from './api';

// Import both services for the migration phase
import { 
  mongodbService,
  login as mongoLogin,
  register as mongoRegister,
  logout as mongoLogout,
  getUserProfile as mongoGetUserProfile,
  createTestUsers as mongoCreateTestUsers,
  USER_ROLES as MONGODB_USER_ROLES
} from './mongodbService';

import supabaseService, { USER_ROLES as SUPABASE_USER_ROLES } from './supabaseService';

// Use MinimalStudent to reduce type complexity
import { MinimalStudent } from '@/types/student';

// Export both services during migration phase
export {
  // MongoDB exports
  mongodbService,
  mongoLogin as login,
  mongoRegister as register,
  mongoLogout as logout,
  mongoGetUserProfile as getUserProfile,
  mongoCreateTestUsers as createTestUsers,
  MONGODB_USER_ROLES as USER_ROLES,
  
  // Supabase exports for backward compatibility
  supabaseService
};
