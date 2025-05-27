const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { User } = require('../models/users/User');

// JWT Secret - should be stored in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-jwt-secret-key-replace-in-production';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '7d';

/**
 * Authentication Service
 * Handles user authentication, token generation, and validation
 */
const authService = {
  /**
   * Register a new user
   * @param {Object} userData - User data including email, password, etc.
   * @returns {Object} Newly created user
   */
  async registerUser(userData) {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      if (existingUser) {
        throw new Error('User with this email already exists');
      }

      // Create new user
      const user = new User(userData);
      await user.save();
      
      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Authenticate user and generate JWT token
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {string} tenantSlug - Optional tenant slug for tenant-specific authentication
   * @returns {Object} User data and JWT token
   */
  async loginUser(email, password, tenantSlug) {
    try {
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Check if user is active
      if (user.account_status !== 'active') {
        throw new Error(`Account is ${user.account_status}. Please contact administrator.`);
      }

      // Verify password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        throw new Error('Invalid email or password');
      }
      console.log("User found and password verified",user);
      
      // Get tenant info based on the provided slug or user's assigned tenant
      const Tenant = require('../models/organization/Tenant');
      let tenant = null;

      // Check if user is super_admin for special handling
      const isSuperAdmin = user.role === 'super_admin';
      const isGeneralLoginRoute = !tenantSlug; // If no tenantSlug, assume general login route

      console.log(`Login attempt - User: ${user.email}, Role: ${user.role}, TenantSlug: ${tenantSlug || 'none'}`);

      // CASE 1: Super admin using general login route - don't enforce tenant
      if (isSuperAdmin && isGeneralLoginRoute) {
        console.log('Super admin login via general route - no tenant validation needed');
        // Super admin can still have a default tenant if one is assigned
        if (user.tenant_id) {
          tenant = await Tenant.findOne({ _id: user.tenant_id });
          if (tenant) {
            console.log(`Super admin has default tenant: ${tenant.slug}`);
          }
        }
      }
      // CASE 2: Specific tenant slug provided in the request
      else if (tenantSlug) {
        console.log(`Tenant-specific login attempt for: ${tenantSlug}`);
        tenant = await Tenant.findOne({ slug: tenantSlug });
        
        if (!tenant) {
          throw new Error(`Tenant with slug '${tenantSlug}' not found`);
        }

        // For non-super_admin users, verify they belong to this tenant
        if (!isSuperAdmin && user.tenant_id && user.tenant_id.toString() !== tenant._id.toString()) {
          throw new Error(`User is not authorized for tenant '${tenantSlug}'`);
        }
      }
      // CASE 3: No tenant slug provided, but user has an assigned tenant
      else if (user.tenant_id) {
        console.log(`User has assigned tenant_id: ${user.tenant_id}`);
        tenant = await Tenant.findOne({ _id: user.tenant_id });
        if (tenant) {
          console.log(`Found user's tenant: ${tenant.slug}`);
        }
      }

      // Set tenant info on user if a tenant was found
      if (tenant) {
        user.tenant_id = tenant._id;
        user.tenant_slug = tenant.slug;
        console.log(`Setting user tenant to: ${tenant.slug}`);
      } else {
        console.log('No tenant found or assigned for this user');
      }

      // If super_admin without a tenant, we still keep them authenticated
      if (isSuperAdmin && !tenant) {
        console.log('Super admin authenticated without specific tenant');
      }
      

      // Update last login timestamp
      user.last_login = new Date();
      await user.save();

      // Generate JWT token with tenant info
      const token = this.generateToken(user);

      // Prepare user response
      const userJSON = user.toJSON();
      
      // Always ensure role is correctly set
      userJSON.role = user.role;
      
      // Add tenant information to response if available
      if (tenant && tenant.slug) {
        userJSON.tenant_slug = tenant.slug;
        userJSON.tenant_id = tenant._id.toString();
        console.log(`Response includes tenant: ${tenant.slug}`);
      } else if (tenantSlug) {
        userJSON.tenant_slug = tenantSlug;
        console.log(`Response includes requested tenant slug: ${tenantSlug}`);
      }
      
      // Log the final response for debugging
      console.log('Final user response:', {
        id: userJSON.id || userJSON._id,
        email: userJSON.email,
        role: userJSON.role,
        tenant_slug: userJSON.tenant_slug || 'none'
      });

      return {
        user: userJSON,
        token
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Generate JWT token for authenticated user
   * @param {Object} user - User document
   * @returns {string} JWT token
   */
  generateToken(user) {
    const payload = {
      user: {
        id: user._id,
        email: user.email,
        role: user.role,
        tenant_id: user.tenant_id,
        tenant_slug: user.tenant_slug // Include tenant slug in token payload
      }
    };

    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  },

  /**
   * Verify JWT token
   * @param {string} token - JWT token
   * @returns {Object} Decoded token payload
   */
  verifyToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  },

  /**
   * Get user by ID
   * @param {string} userId - User ID
   * @returns {Object} User document
   */
  async getUserById(userId) {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Send password reset email
   * @param {string} email - User email
   * @returns {boolean} Success status
   */
  async forgotPassword(email) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      // Generate reset token
      const resetToken = Math.random().toString(36).substring(2, 15) + 
                         Math.random().toString(36).substring(2, 15);
      
      // Set expiration (1 hour)
      const resetExpires = Date.now() + 3600000;

      // Update user with reset token
      user.reset_password_token = resetToken;
      user.reset_password_expires = resetExpires;
      await user.save();

      // In a real application, send email with reset link
      // For now, we'll just return the token
      return {
        success: true,
        message: 'Password reset token generated',
        resetToken
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset password using token
   * @param {string} token - Reset token
   * @param {string} newPassword - New password
   * @returns {boolean} Success status
   */
  async resetPassword(token, newPassword) {
    try {
      const user = await User.findOne({
        reset_password_token: token,
        reset_password_expires: { $gt: Date.now() }
      });

      if (!user) {
        throw new Error('Invalid or expired token');
      }

      // Update password
      user.password = newPassword;
      user.reset_password_token = undefined;
      user.reset_password_expires = undefined;
      await user.save();

      return {
        success: true,
        message: 'Password reset successful'
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Change password for authenticated user
   * @param {string} userId - User ID
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @returns {boolean} Success status
   */
  async changePassword(userId, currentPassword, newPassword) {
    try {
      // Find user
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const isMatch = await user.comparePassword(currentPassword);
      if (!isMatch) {
        throw new Error('Current password is incorrect');
      }

      // Update password
      user.password = newPassword;
      await user.save();

      return true;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Find a user by email
   * @param {string} email - User email
   * @returns {Object|null} User document or null if not found
   */
  async findUserByEmail(email) {
    try {
      return await User.findOne({ email });
    } catch (error) {
      throw error;
    }
  }
};

module.exports = authService;
