
import { supabase } from '@/integrations/supabase/client';
import { checkSupabaseAvailability, USER_ROLES, validateUserRole } from './utils';

// Type for test user results
export interface TestUserResult {
  name: string;
  email: string;
  role: string;
  password: string;
  status: string;
  message?: string;
}

export const login = async (email: string, password: string) => {
  try {
    checkSupabaseAvailability();
    
    console.log("Attempting to login with email:", email);
    
    // Try to sign in with password
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Supabase auth error:", error);
      throw error;
    }

    if (!data.user) {
      console.error("No user returned from sign in attempt");
      throw new Error("User not found. Please check your email or register a new account.");
    }

    console.log("Login successful. Getting profile data for user:", data.user.id);
    
    // Try to get user profile data, but handle errors gracefully
    try {
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*, schools(name, id)')
        .eq('id', data.user.id)
        .single();
      
      if (profileError) {
        console.warn("Profile fetch error:", profileError.message);
        
        // Create basic profile if it doesn't exist
        if (profileError.code === 'PGRST116') {
          console.log("Profile not found. Creating new profile.");
          
          try {
            // Create a basic profile with minimal data
            await supabase.from('profiles').insert({
              id: data.user.id,
              name: data.user.email?.split('@')[0] || 'User',
              email: data.user.email || '',
              role: 'student'
            });
            
            // Use minimal profile data until next login
            const userData = {
              id: data.user.id,
              name: data.user.email?.split('@')[0] || 'User',
              email: data.user.email || '',
              role: USER_ROLES.STUDENT,
              schoolId: null,
              schoolName: null,
              token: data.session?.access_token || '',
            };
            
            console.log("New profile created:", userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
          } catch (createError) {
            console.error("Failed to create profile:", createError);
            // Continue with minimal user data
          }
        }
        
        // Fall back to minimal user data if profile can't be fetched
        const userData = {
          id: data.user.id,
          name: data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          role: USER_ROLES.STUDENT,
          schoolId: null,
          schoolName: null,
          token: data.session?.access_token || '',
        };
        
        console.log("Using minimal user data:", userData);
        localStorage.setItem('user', JSON.stringify(userData));
        return userData;
      }
        
      console.log("Profile data retrieved:", profileData);

      // Store user data in localStorage
      const userData = {
        id: data.user.id,
        name: profileData?.name || data.user.email?.split('@')[0] || 'User',
        email: data.user.email || '',
        role: profileData?.role || USER_ROLES.STUDENT,
        schoolId: profileData?.school_id || null,
        schoolName: profileData?.schools?.name || null,
        token: data.session?.access_token || '',
      };
      
      console.log("User data prepared for localStorage:", userData);

      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (profileFetchError) {
      console.error("Error in profile handling:", profileFetchError);
      
      // Fall back to basic user info if everything else fails
      const userData = {
        id: data.user.id,
        name: data.user.email?.split('@')[0] || 'User',
        email: data.user.email || '',
        role: USER_ROLES.STUDENT,
        schoolId: null,
        schoolName: null,
        token: data.session?.access_token || '',
      };
      
      console.log("Using fallback user data:", userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const register = async (name: string, email: string, password: string, role: string = USER_ROLES.STUDENT, schoolId: string | null = null) => {
  try {
    checkSupabaseAvailability();
    
    console.log("Attempting to register user:", email, "with role:", role);
    
    // First, check if Supabase auth already has this user
    const { data: authUser, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          role: validateUserRole(role),
        },
      },
    });

    // If there's an error that's not "User already registered", throw it
    if (authError && !authError.message.includes('already registered')) {
      console.error("Registration error:", authError);
      throw authError;
    }

    // If user was created or already exists in auth, create/update the profile
    if (authUser.user || (authError && authError.message.includes('already registered'))) {
      // Try to get existing user ID if not available from signup
      let userId = authUser.user?.id;
      
      if (!userId && authError?.message.includes('already registered')) {
        // If user already exists, we need to get their ID from auth
        console.log("User already exists in auth, fetching existing user");
        
        // Try to sign in to get the user ID
        const { data: signInData } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        
        userId = signInData.user?.id;
      }
      
      if (!userId) {
        throw new Error("Could not determine user ID for profile creation");
      }
      
      console.log("Creating/updating profile for user:", userId);
      
      // Upsert the profile record
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: userId, 
          name, 
          email,
          role: validateUserRole(role),
          school_id: schoolId
        });

      if (profileError) {
        console.error("Error creating/updating profile:", profileError);
        throw profileError;
      }
      
      return { success: true, message: 'User registered successfully', userId };
    }
    
    throw new Error('Registration failed');
  } catch (error: any) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async () => {
  await supabase.auth.signOut();
  localStorage.removeItem('user');
};

// Create test users with different roles - improved version with better error handling
export const createTestUsers = async (): Promise<TestUserResult[]> => {
  try {
    checkSupabaseAvailability();
    console.log("Starting creation of test users");
    
    // Default password for all test users
    const defaultPassword = "Password123!";
    
    // Define test users with different roles
    const testUsers = [
      { name: "Super Admin", email: "superadmin@campuscore.edu", role: USER_ROLES.SUPER_ADMIN },
      { name: "School Admin", email: "schooladmin@campuscore.edu", role: USER_ROLES.SCHOOL_ADMIN },
      { name: "Teacher", email: "teacher@campuscore.edu", role: USER_ROLES.TEACHER },
      { name: "Student", email: "student@campuscore.edu", role: USER_ROLES.STUDENT },
      { name: "Parent", email: "parent@campuscore.edu", role: USER_ROLES.PARENT },
      { name: "Accountant", email: "accountant@campuscore.edu", role: USER_ROLES.ACCOUNTANT },
      { name: "Librarian", email: "librarian@campuscore.edu", role: USER_ROLES.LIBRARIAN },
      { name: "Receptionist", email: "receptionist@campuscore.edu", role: USER_ROLES.RECEPTIONIST },
      { name: "Transport Manager", email: "transport@campuscore.edu", role: USER_ROLES.TRANSPORT_MANAGER }
    ];
    
    const results: TestUserResult[] = [];
    
    // Process each test user individually to isolate potential errors
    for (const user of testUsers) {
      try {
        console.log(`Processing test user: ${user.email}`);
        
        // Check if user already exists first
        const { data: existingUserData, error: existingUserError } = await supabase.auth.signInWithPassword({
          email: user.email,
          password: defaultPassword,
        });
        
        if (!existingUserError && existingUserData.user) {
          console.log(`User ${user.email} already exists`);
          results.push({ 
            ...user, 
            status: 'Exists', 
            password: defaultPassword,
            message: 'User already exists, can be used for login'
          });
          continue;
        }
        
        // Attempt to sign up the user
        console.log(`Creating new user: ${user.email}`);
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: user.email,
          password: defaultPassword,
          options: {
            data: {
              name: user.name,
              role: validateUserRole(user.role),
            },
          },
        });
        
        // Handle different response cases
        if (authError) {
          // Check if this is just a "user exists" error, which we can treat as a success
          if (authError.message.includes('already registered')) {
            console.log(`User ${user.email} already exists, proceeding to profile check`);
            results.push({ 
              ...user, 
              status: 'Exists', 
              password: defaultPassword,
              message: 'User already exists, can be used for login'
            });
            continue;
          } else {
            // This is a genuine error
            console.error(`Error creating auth user for ${user.email}:`, authError);
            results.push({ 
              ...user, 
              status: 'Error', 
              password: defaultPassword,
              message: authError.message || 'Unknown error'
            });
            continue;
          }
        }
        
        // If we got here, the user was created successfully
        if (authData.user) {
          console.log(`Auth user created successfully for ${user.email}`);
          
          try {
            // Ensure profile exists
            const { error: profileError } = await supabase
              .from('profiles')
              .upsert({
                id: authData.user.id,
                name: user.name,
                email: user.email,
                role: validateUserRole(user.role)
              });
              
            if (profileError) {
              console.warn(`Warning: Could not create profile for ${user.email}:`, profileError);
            }
          } catch (profileError) {
            console.warn(`Warning: Error creating profile for ${user.email}:`, profileError);
          }
          
          results.push({ 
            ...user, 
            status: 'Created', 
            password: defaultPassword,
            message: 'User created successfully'
          });
        } else {
          // This should not happen often, but handle it just in case
          console.warn(`Unexpected response for ${user.email}: No error but no user either`);
          results.push({ 
            ...user, 
            status: 'Warning', 
            password: defaultPassword,
            message: 'Unexpected response from signup API'
          });
        }
      } catch (userError: any) {
        // Catch any unexpected errors for this specific user
        console.error(`Unexpected error creating ${user.role} user:`, userError);
        results.push({ 
          ...user, 
          status: 'Error', 
          password: defaultPassword,
          message: userError.message || 'Unknown error'
        });
      }
    }
    
    console.log("Test users creation completed with results:", results);
    return results;
  } catch (error) {
    console.error('Error creating test users:', error);
    throw error;
  }
};
