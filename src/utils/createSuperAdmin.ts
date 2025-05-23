
import { mongodbService } from '@/lib/services';

export const createSuperAdmin = async (userData: any) => {
  try {
    // Create super admin user
    const response = await mongodbService.createUser({
      name: userData.name,
      email: userData.email,
      password: userData.password,
      role: 'super_admin'
    });
    
    console.log('Super admin created successfully:', response);
    return { success: true, message: 'Super admin created successfully', data: response };
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { success: false, message: 'Error creating super admin', error };
  }
};
