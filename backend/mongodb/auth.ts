import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { checkMongoDBAvailability } from './connection';
import { User, Profile, USER_ROLES } from './models';
import { IUser } from './models/User';

// Secret key for JWT tokens - this should be in an environment variable in production
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-replace-in-production';

// Type for test user results
export interface TestUserResult {
  name: string;
  email: string;
  role: string;
  password: string;
  status: string;
  message?: string;
}

// Helper function to validate user role
export function validateUserRole(role: string): string {
  const validRoles = Object.values(USER_ROLES);
  
  if (validRoles.includes(role as any)) {
    return role;
  }
  
  console.warn(`Invalid role: ${role}. Defaulting to student.`);
  return USER_ROLES.STUDENT;
}

// Generate JWT token for authentication
function generateToken(user: IUser) {
  return jwt.sign(
    { 
      id: user._id, 
      email: user.email,
      role: user.role
    }, 
    JWT_SECRET, 
    { expiresIn: '7d' }
  );
}

export const login = async (email: string, password: string) => {
  try {
    checkMongoDBAvailability();
    
    console.log("Attempting to login with email:", email);
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      console.error("No user found with email:", email);
      throw new Error("User not found. Please check your email or register a new account.");
    }
    
    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.error("Invalid password for email:", email);
      throw new Error("Invalid credentials. Please check your email and password.");
    }
    
    // Generate auth token
    const token = generateToken(user);
    
    console.log("Login successful. Getting profile data for user:", user._id);
    
    // Try to get user profile data
    try {
      let profileData = await Profile.findOne({ id: user._id.toString() });
      
      if (!profileData) {
        console.warn("Profile not found. Creating new profile.");
        
        // Create a basic profile with minimal data
        profileData = await Profile.create({
          id: user._id.toString(),
          name: user.email.split('@')[0] || 'User',
          email: user.email,
          role: USER_ROLES.STUDENT
        });
      }
      
      // Store user data in localStorage
      const userData = {
        id: user._id,
        name: profileData?.name || user.email?.split('@')[0] || 'User',
        email: user.email,
        role: profileData?.role || USER_ROLES.STUDENT,
        schoolId: profileData?.school_id || null,
        schoolName: null, // This would need a separate query to get school name
        token: token,
      };
      
      console.log("User data prepared for localStorage:", userData);
      
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (profileError) {
      console.error("Error in profile handling:", profileError);
      
      // Fall back to basic user info if everything else fails
      const userData = {
        id: user._id,
        name: user.email.split('@')[0] || 'User',
        email: user.email,
        role: USER_ROLES.STUDENT,
        schoolId: null,
        schoolName: null,
        token: token,
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
    checkMongoDBAvailability();
    
    console.log("Attempting to register user:", email, "with role:", role);
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    
    if (existingUser) {
      console.log("User already exists:", email);
      throw new Error("User with this email already exists.");
    }
    
    // Create new user
    const newUser = await User.create({
      email,
      password, // Will be hashed by pre-save hook
      name,
      role: validateUserRole(role),
      aud: 'authenticated',
      raw_user_meta_data: JSON.stringify({
        name: name
      })
    });
    
    console.log("User created successfully:", newUser._id);
    
    // Create user profile
    const profile = await Profile.create({
      id: newUser._id.toString(),
      name,
      email,
      role: validateUserRole(role),
      school_id: schoolId,
      created_at: new Date(),
      updated_at: new Date()
    });
    
    console.log("Profile created for user:", profile.id);
    
    return { success: true, message: 'User registered successfully', userId: newUser._id };
  } catch (error: any) {
    console.error('Registration error:', error);
    throw error;
  }
};

export const logout = async () => {
  // Clear user data from localStorage
  localStorage.removeItem('user');
};

// Create test users with different roles
export const createTestUsers = async (): Promise<TestUserResult[]> => {
  try {
    checkMongoDBAvailability();
    console.log("Starting creation of test users");
    
    // Default password for all test users
    const defaultPassword = "Password123!";
    
    // Define test users with different roles
    const testUsers = [
      { name: "super_admin", email: "superadmin@campuscore.edu", role: USER_ROLES.SUPER_ADMIN },
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
    
    // Process each test user individually
    for (const user of testUsers) {
      try {
        console.log(`Processing test user: ${user.email}`);
        
        // Check if user already exists
        const existingUser = await User.findOne({ email: user.email });
        
        if (existingUser) {
          console.log(`User ${user.email} already exists`);
          results.push({ 
            ...user, 
            status: 'Exists', 
            password: defaultPassword,
            message: 'User already exists, can be used for login'
          });
          continue;
        }
        
        // Create new user
        const newUser = await User.create({
          email: user.email,
          password: defaultPassword, // Will be hashed by pre-save hook
          name: user.name,
          role: validateUserRole(user.role),
          aud: 'authenticated',
          raw_user_meta_data: JSON.stringify({
            name: user.name
          })
        });
        
        // Create profile for the user
        await Profile.create({
          id: newUser._id.toString(),
          name: user.name,
          email: user.email,
          role: validateUserRole(user.role),
          created_at: new Date(),
          updated_at: new Date()
        });
        
        results.push({ 
          ...user, 
          status: 'Created', 
          password: defaultPassword,
          message: 'User created successfully'
        });
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
