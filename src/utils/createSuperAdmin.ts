
import { mongodbService } from '@/lib/services';

export const createSuperAdmin = async (email: string, password: string, name: string) => {
  try {
    // Check if super admin already exists
    const existingUsers = await mongodbService.getUsers();
    const existingUser = existingUsers.find(user => user.email === email);
    
    if (existingUser) {
      console.log('Super admin already exists');
      return { success: false, message: 'Super admin already exists' };
    }

    // Create super admin user
    const userData = {
      name,
      email,
      password,
      role: 'super_admin'
    };

    const result = await mongodbService.createUser(userData);
    
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
