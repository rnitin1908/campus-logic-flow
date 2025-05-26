const authService = require('../services/authService');

/**
 * Authentication Controller
 * Handles API endpoints for authentication
 */
const authController = {
  /**
   * Register a new user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  register: async (req, res) => {
    try {
      const { name, email, password, role, tenant_id, school_id, phone } = req.body;

      // Basic validation
      if (!name || !email || !password || !tenant_id) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Register user
      const user = await authService.registerUser({
        name,
        email,
        password,
        role,
        tenant_id,
        school_id,
        phone,
        account_status: 'active',
        email_verified: false
      });

      // Generate token
      const token = authService.generateToken(user);

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: user.toJSON(),
          token
        }
      });
    } catch (error) {
      console.error('Error in user registration:', error);
      
      // Handle duplicate email
      if (error.message.includes('already exists')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error registering user',
        error: error.message
      });
    }
  },

  /**
   * Login user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  login: async (req, res) => {
    try {
      // Extract tenant slug from URL params or request body
      let { email, password, tenantSlug } = req.body;
      console.log('Tenant slug from request body:', email, password, tenantSlug);
      
      // If tenantSlug is not in request body but is in URL params, use that
      if (!tenantSlug && req.params.tenantSlug) {
        tenantSlug = req.params.tenantSlug;
      }

      // Basic validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          message: 'Please provide email and password'
        });
      }

      // Login user with optional tenant validation
      const { user, token } = await authService.loginUser(email, password, tenantSlug);

      // Add tenant_slug to response if available
      if (user.tenant_slug || tenantSlug) {
        user.tenant_slug = user.tenant_slug || tenantSlug;
      }

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user,
          token
        }
      });
    } catch (error) {
      console.error('Error in user login:', error);
      
      // Handle invalid credentials or tenant mismatch
      if (error.message.includes('Invalid email or password') || 
          error.message.includes('Account is') ||
          error.message.includes('not authorized for tenant')) {
        return res.status(401).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error logging in',
        error: error.message
      });
    }
  },

  /**
   * Get current user
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getCurrentUser: async (req, res) => {
    try {
      // Get user ID from authenticated request
      const userId = req.user.id;

      // Get user details
      const user = await authService.getUserById(userId);

      res.status(200).json({
        success: true,
        data: {
          user: user.toJSON()
        }
      });
    } catch (error) {
      console.error('Error getting current user:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving user data',
        error: error.message
      });
    }
  },

  /**
   * Forgot password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;

      // Basic validation
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Please provide an email address'
        });
      }

      // Process forgot password
      const result = await authService.forgotPassword(email);

      res.status(200).json({
        success: true,
        message: 'Password reset email sent',
        // In production, don't send the token in the response
        // Just for development/testing
        resetToken: result.resetToken
      });
    } catch (error) {
      console.error('Error in forgot password:', error);
      
      // Don't reveal if user exists for security
      if (error.message.includes('User not found')) {
        return res.status(200).json({
          success: true,
          message: 'If a user with that email exists, a password reset link will be sent'
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error processing password reset',
        error: error.message
      });
    }
  },

  /**
   * Reset password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  resetPassword: async (req, res) => {
    try {
      const { token, newPassword } = req.body;

      // Basic validation
      if (!token || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide token and new password'
        });
      }

      // Process password reset
      const result = await authService.resetPassword(token, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password reset successful'
      });
    } catch (error) {
      console.error('Error in reset password:', error);
      
      if (error.message.includes('Invalid or expired token')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error resetting password',
        error: error.message
      });
    }
  },

  /**
   * Change password
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;

      // Basic validation
      if (!currentPassword || !newPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide current password and new password'
        });
      }

      // Process password change
      const result = await authService.changePassword(userId, currentPassword, newPassword);

      res.status(200).json({
        success: true,
        message: 'Password changed successfully'
      });
    } catch (error) {
      console.error('Error in change password:', error);
      
      if (error.message.includes('Current password is incorrect')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error changing password',
        error: error.message
      });
    }
  },
  /**
   * Create test users for development and testing
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createTestUsers: async (req, res) => {
    try {
      console.log('Creating test users with proper ObjectId references...');
      
      // First, get or create the default tenant
      const tenantService = require('../services/tenantService');
      const defaultTenant = await tenantService.getOrCreateDefaultTenant();
      console.log('Default tenant:', defaultTenant._id);
      
      // Now, get or create a default school with the tenant ID
      const schoolService = require('../services/schoolService');
      
      // Try to find existing school with code 'CCA'
      let defaultSchool = await schoolService.getSchoolByCode('CCA');
      
      // If school doesn't exist, create it
      if (!defaultSchool) {
        defaultSchool = await schoolService.createSchool({
          name: 'Campus Core Academy',
          code: 'CCA',
          address: {
            street: '123 Education Street',
            city: 'Knowledge City',
            state: 'Learning State',
            country: 'India',
            pincode: '110001'
          },
          contact_info: {
            phone: '+91 9876543210',
            email: 'info@campuscore.edu'
          },
          website: 'https://campuscore.edu',
          tenant_id: defaultTenant._id, // Use actual tenant ObjectId
          status: 'active'
        });
      }
      
      console.log('Default school:', defaultSchool._id);
      
      // Define test users with different roles
      const testUsers = [
        {
          name: 'Super Admin',
          email: 'superadmin@campuscore.edu',
          password: 'Password123!',
          role: 'super_admin',
          tenant_id: defaultTenant._id,
          school_id: null // Super admin is not associated with a specific school
        },
        {
          name: 'School Admin',
          email: 'schooladmin@campuscore.edu',
          password: 'Password123!',
          role: 'school_admin',
          tenant_id: defaultTenant._id,
          school_id: defaultSchool._id
        },
        {
          name: 'Teacher',
          email: 'teacher@campuscore.edu',
          password: 'Password123!',
          role: 'teacher',
          tenant_id: defaultTenant._id,
          school_id: defaultSchool._id
        },
        {
          name: 'Student',
          email: 'student@campuscore.edu',
          password: 'Password123!',
          role: 'student',
          tenant_id: defaultTenant._id,
          school_id: defaultSchool._id
        },
        {
          name: 'Parent',
          email: 'parent@campuscore.edu',
          password: 'Password123!',
          role: 'parent',
          tenant_id: defaultTenant._id,
          school_id: defaultSchool._id
        },
        {
          name: 'Accountant',
          email: 'accountant@campuscore.edu',
          password: 'Password123!',
          role: 'accountant',
          tenant_id: defaultTenant._id,
          school_id: defaultSchool._id
        },
        {
          name: 'Librarian',
          email: 'librarian@campuscore.edu',
          password: 'Password123!',
          role: 'librarian',
          tenant_id: defaultTenant._id,
          school_id: defaultSchool._id
        },
        {
          name: 'Receptionist',
          email: 'receptionist@campuscore.edu',
          password: 'Password123!',
          role: 'receptionist',
          tenant_id: defaultTenant._id,
          school_id: defaultSchool._id
        },
        {
          name: 'Transport Manager',
          email: 'transport@campuscore.edu',
          password: 'Password123!',
          role: 'transport_manager',
          tenant_id: defaultTenant._id,
          school_id: defaultSchool._id
        }
      ];
      
      // Create users or update if they already exist
      const results = await Promise.all(
        testUsers.map(async (userData) => {
          try {
            // Try to find existing user
            const existingUser = await authService.findUserByEmail(userData.email);
            
            if (existingUser) {
              return {
                name: userData.name,
                email: userData.email,
                role: userData.role,
                status: 'Exists'
              };
            }
            
            // Create new user
            const newUser = await authService.registerUser({
              ...userData,
              account_status: 'active',
              email_verified: true
            });
            
            return {
              name: userData.name,
              email: userData.email,
              role: userData.role,
              status: 'Created'
            };
          } catch (error) {
            console.error(`Error creating test user ${userData.email}:`, error);
            return {
              name: userData.name,
              email: userData.email,
              role: userData.role,
              status: 'Failed',
              message: error.message
            };
          }
        })
      );
      
      res.status(200).json({
        success: true,
        message: 'Test users processed',
        data: results
      });
    } catch (error) {
      console.error('Error creating test users:', error);
      res.status(500).json({
        success: false,
        message: 'Error creating test users',
        error: error.message
      });
    }
  }
};

module.exports = authController;
