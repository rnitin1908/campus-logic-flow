
import { supabaseService } from '@/lib/services';

// Type for test user results
export interface TestUserResult {
  name: string;
  email: string;
  role: string;
  password: string;
  status: string;
  message?: string;
}

// This utility function creates test users with different roles
export async function createTestUsers(): Promise<TestUserResult[]> {
  try {
    console.log('Creating test users...');
    
    // Default test users if creation fails
    const defaultUsers = [
      { name: "Super Admin", email: "superadmin@campuscore.edu", role: "super_admin", password: "Password123!", status: "Default" },
      { name: "School Admin", email: "schooladmin@campuscore.edu", role: "school_admin", password: "Password123!", status: "Default" },
      { name: "Teacher", email: "teacher@campuscore.edu", role: "teacher", password: "Password123!", status: "Default" },
      { name: "Student", email: "student@campuscore.edu", role: "student", password: "Password123!", status: "Default" }
    ];
    
    try {
      // Try to create users with Supabase
      const results = await supabaseService.createTestUsers();
      
      console.log('\n=== Test Users Created ===');
      console.table(results.map(user => ({
        Name: user.name,
        Email: user.email,
        Role: user.role,
        Password: user.password,
        Status: user.status
      })));
      
      return results;
    } catch (supabaseError) {
      console.error('Error creating test users with Supabase:', supabaseError);
      console.log('Returning default test users instead');
      
      return defaultUsers;
    }
  } catch (error) {
    console.error('Error creating test users:', error);
    
    // Return default users as fallback
    return [
      { name: "Super Admin", email: "superadmin@campuscore.edu", role: "super_admin", password: "Password123!", status: "Default" },
      { name: "School Admin", email: "schooladmin@campuscore.edu", role: "school_admin", password: "Password123!", status: "Default" },
      { name: "Teacher", email: "teacher@campuscore.edu", role: "teacher", password: "Password123!", status: "Default" },
      { name: "Student", email: "student@campuscore.edu", role: "student", password: "Password123!", status: "Default" }
    ];
  }
}

// Run the function when this script is executed directly
if (typeof window !== 'undefined') {
  // Only run in browser environment when called directly
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('createUsers') === 'true') {
    createTestUsers()
      .then(users => {
        console.log('Users created successfully:', users);
      })
      .catch(err => {
        console.error('Failed to create users:', err);
      });
  }
}
