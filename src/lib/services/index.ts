
// Re-export API service
export * from './api';

// Re-export Supabase services but avoid duplicating already exported identifiers
export * from './supabase';

// Export MongoDB service and its functions while avoiding name conflicts
// We need to use explicit exports to avoid conflicts with Supabase exports
import { 
  mongodbService,
  login as mongoLogin,
  register as mongoRegister,
  logout as mongoLogout,
  getUserProfile as mongoGetUserProfile,
  createTestUsers as mongoCreateTestUsers,
  USER_ROLES as MONGODB_USER_ROLES
} from './mongodbService';

export {
  mongodbService,
  // We don't re-export these since they conflict with Supabase exports
  // Use the mongodbService object to access these functions instead
};
