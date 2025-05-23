const authService = require('../services/authService');
const { USER_ROLES } = require('../models/users/User');

/**
 * Authentication Middleware
 * Verifies JWT token and adds user data to request
 */
const authMiddleware = {
  /**
   * Verify JWT token from Authorization header
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  protect: async (req, res, next) => {
    try {
      let token;

      // Get token from Authorization header
      if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
      }

      // Check if token exists
      if (!token) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - No token provided'
        });
      }

      try {
        // Verify token
        const decoded = authService.verifyToken(token);
        
        // Add user data to request
        req.user = decoded.user;
        
        next();
      } catch (error) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - Invalid token'
        });
      }
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error',
        error: error.message
      });
    }
  },

  /**
   * Restrict routes based on user roles
   * @param {Array} roles - Array of allowed roles
   * @returns {Function} Middleware function
   */
  restrictTo: (roles) => {
    return (req, res, next) => {
      // Check if user exists and has a role
      if (!req.user || !req.user.role) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden - Access denied'
        });
      }

      // Check if user's role is in the allowed roles
      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          success: false,
          message: 'Forbidden - Insufficient permissions'
        });
      }

      next();
    };
  },

  /**
   * Middleware for admin only routes
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  adminOnly: (req, res, next) => {
    // Check if user exists and has a role
    if (!req.user || !req.user.role) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - Access denied'
      });
    }

    // Check if user is an admin
    const adminRoles = [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN];
    if (!adminRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - Admin access required'
      });
    }

    next();
  },

  /**
   * Middleware to check if user is accessing their own data
   * Used for routes where users should only access their own resources
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  checkOwnership: (req, res, next) => {
    // Check if user exists
    if (!req.user) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - Access denied'
      });
    }

    // Get user ID from request params or query
    const resourceUserId = req.params.userId || req.query.userId;

    // If user is an admin, allow access
    const adminRoles = [USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN];
    if (adminRoles.includes(req.user.role)) {
      return next();
    }

    // Check if user is accessing their own data
    if (resourceUserId && resourceUserId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Forbidden - You can only access your own data'
      });
    }

    next();
  }
};

module.exports = authMiddleware;
