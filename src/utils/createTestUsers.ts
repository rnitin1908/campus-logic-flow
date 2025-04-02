
import { supabaseService } from '@/lib/services';

// This utility function creates test users with different roles
export async function createTestUsers() {
  try {
    console.log('Creating test users...');
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
  } catch (error) {
    console.error('Error creating test users:', error);
    throw error;
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
