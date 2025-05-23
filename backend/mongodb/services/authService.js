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
   * @returns {Object} User data and JWT token
   */
  async loginUser(email, password) {
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

      // Update last login timestamp
      user.last_login = new Date();
      await user.save();

      // Generate JWT token
      const token = this.generateToken(user);

      return {
        user: user.toJSON(),
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
        tenant_id: user.tenant_id
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
