
// MongoDB-compatible service (renamed for backward compatibility)
import { mongodbService, USER_ROLES } from './mongodbService';

// Re-export MongoDB service as supabaseService for backward compatibility
const supabaseService = {
  ...mongodbService,
  // Add any additional methods that were expected from supabase
  auth: {
    signOut: mongodbService.logout,
    getUser: () => {
      const user = localStorage.getItem('auth_user');
      return user ? { data: { user: JSON.parse(user) } } : { data: { user: null } };
    }
  }
};

export { USER_ROLES };
export default supabaseService;
