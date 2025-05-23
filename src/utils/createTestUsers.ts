
import { createTestUsers as mongoCreateTestUsers } from '@/lib/services';

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
    const defaultUsers: TestUserResult[] = [
      { name: "Super Admin", email: "superadmin@campuscore.edu", role: "super_admin", password: "Password123!", status: "Default" },
      { name: "School Admin", email: "schooladmin@campuscore.edu", role: "school_admin", password: "Password123!", status: "Default" },
      { name: "Teacher", email: "teacher@campuscore.edu", role: "teacher", password: "Password123!", status: "Default" },
      { name: "Student", email: "student@campuscore.edu", role: "student", password: "Password123!", status: "Default" },
      { name: "Parent", email: "parent@campuscore.edu", role: "parent", password: "Password123!", status: "Default" },
      { name: "Accountant", email: "accountant@campuscore.edu", role: "accountant", password: "Password123!", status: "Default" },
      { name: "Librarian", email: "librarian@campuscore.edu", role: "librarian", password: "Password123!", status: "Default" },
      { name: "Receptionist", email: "receptionist@campuscore.edu", role: "receptionist", password: "Password123!", status: "Default" },
      { name: "Transport Manager", email: "transport@campuscore.edu", role: "transport_manager", password: "Password123!", status: "Default" }
    ];
    
    try {
      // Try to create users with MongoDB
      const response = await mongoCreateTestUsers();
      
      if (response && Array.isArray(response)) {
        // Format the results to match the expected interface
        const results: TestUserResult[] = response.map(user => ({
          name: user.name,
          email: user.email,
          role: user.role,
          password: "Password123!", // Default password for all test users
          status: user.status,
          message: user.message || ''
        }));
        
        console.log('\n=== Test Users Created ===');
        console.table(results.map(user => ({
          Name: user.name,
          Email: user.email,
          Role: user.role,
          Password: user.password,
          Status: user.status
        })));
        
        return results;
      } else {
        console.error('Error creating test users with MongoDB');
        console.log('Returning default test users instead');
        
        return defaultUsers;
      }
    } catch (mongoError) {
      console.error('Error creating test users with MongoDB:', mongoError);
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
