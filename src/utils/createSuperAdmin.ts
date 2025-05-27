
import { mongodbService } from '@/lib/services';

export const createSuperAdmin = async (userData: any) => {
  try {
    // Create super admin user using register method
    const response = await mongodbService.register(
      userData.name,
      userData.email,
      userData.password,
      'super_admin'
    );
    
    console.log('Super admin created successfully:', response);
    return { success: true, message: 'Super admin created successfully', data: response };
  } catch (error) {
    console.error('Error creating super admin:', error);
    return { success: false, message: 'Error creating super admin', error };
  }
};
