
import { mongodbService } from '@/lib/services';

export const createSuperAdmin = async (email: string, password: string, name: string) => {
  try {
    // Check if super admin already exists by trying to login
    try {
      await mongodbService.login(email, password);
      console.log('Super admin already exists');
      return { success: false, message: 'Super admin already exists' };
    } catch (error) {
      // User doesn't exist, we can create them
    }

    // Create super admin user
    const userData = {
      name,
      email,
      password,
      role: 'super_admin'
    };

    const result = await mongodbService.register(userData);
    
    if (result) {
      console.log('Super admin created successfully');
      return { success: true, message: 'Super admin created successfully', data: result };
    } else {
      throw new Error('Failed to create super admin');
    }
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
