
// Re-export API service
export * from './api';

// Import services
import mongodbService, { 
  login,
  register,
  logout,
  getUserProfile,
  createTestUsers,
  USER_ROLES as MONGODB_USER_ROLES
} from './mongodbService';

import supabaseService, { USER_ROLES as SUPABASE_USER_ROLES } from './supabaseService';

// Export both services during migration phase
export {
  // MongoDB exports
  mongodbService,
  login,
  register,
  logout,
  getUserProfile,
  createTestUsers,
  MONGODB_USER_ROLES as USER_ROLES,
  
  // Supabase exports for backward compatibility
  supabaseService
};
