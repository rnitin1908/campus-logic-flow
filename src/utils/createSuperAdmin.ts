import { apiClient } from '@/lib/services/api';
import { USER_ROLES } from '@/lib/constants/roles';

// Helper function to validate user role
const validateUserRole = (role: string): boolean => {
  return Object.values(USER_ROLES).includes(role as any);
};

/**
 * Creates a superadmin account in MongoDB
 * Run this utility once to setup your initial admin account
 */
export async function createSuperAdmin() {
  const email = 'superadmin@campuscore.edu';
  const password = 'Password123!';
  const name = 'Super Administrator';
  
  try {
    console.log('Creating superadmin account...');
    
    // Check if user exists first
    try {
      const response = await apiClient.post('/auth/login', {
        email,
        password
      });
      console.log('User already exists, logged in successfully');
      return response.data;
    } catch (error) {
      console.log('User does not exist, will create');
    }
    
    if (existingUser?.user) {
      console.log('Superadmin account already exists.');
      return {
        success: true,
        message: 'Superadmin account already exists',
        user: {
          email,
          name,
          role: validateUserRole(USER_ROLES.SUPER_ADMIN)
        }
      };
    }
    
    // User does not exist, create one
    try {
      // Create user account with super admin role
      const createResponse = await apiClient.post('/auth/register', {
        email,
        password,
        name,
        role: USER_ROLES.SUPER_ADMIN
      });
      
      console.log('Superadmin account created successfully.');
      return createResponse.data.user;
    } catch (createError: any) {
      console.error('Error creating superadmin:', createError.message || createError);
      throw createError;
    }
    
    return {
      success: true,
      message: 'Superadmin account created successfully',
      user: {
        id: data.user.id,
        email,
        name,
        role: validateUserRole(USER_ROLES.SUPER_ADMIN)
      }
    };
  } catch (error) {
    console.error('Failed to create superadmin account:', error);
    return {
      success: false,
      message: `Failed to create superadmin account: ${error}`,
      error
    };
  }
}

// Allow direct execution from browser console or script
if (typeof window !== 'undefined') {
  (window as any).createSuperAdmin = createSuperAdmin;
}
