const authService = require('../services/authService');
const { USER_ROLES } = require('../models/users/User');
const Tenant = require('../models/organization/Tenant');

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
  },
  
  /**
   * Verify that the user belongs to the specified tenant
   * Used for tenant-specific routes
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  verifyTenant: async (req, res, next) => {
    try {
      // Check if user exists
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - Authentication required'
        });
      }
      
      // Get tenant slug from URL params
      const tenantSlug = req.params.tenantSlug;
      
      if (!tenantSlug) {
        return next(); // No tenant slug in URL, skip verification
      }
      
      // If user has tenant_slug in token and it matches the URL param, allow access
      if (req.user.tenant_slug && req.user.tenant_slug === tenantSlug) {
        return next();
      }
      
      // If user has tenant_id, verify it matches the tenant slug from params
      if (req.user.tenant_id) {
        // Find tenant by slug
        const tenant = await Tenant.findOne({ slug: tenantSlug });
        
        if (!tenant) {
          return res.status(404).json({
            success: false,
            message: `Tenant '${tenantSlug}' not found`
          });
        }
        
        // Check if tenant ID matches user's tenant ID
        if (tenant._id.toString() !== req.user.tenant_id.toString()) {
          return res.status(403).json({
            success: false,
            message: `Access denied - You are not authorized for tenant '${tenantSlug}'`
          });
        }
        
        // Add tenant info to request for later use
        req.tenant = tenant;
        return next();
      }
      
      // If super admin, allow access to any tenant
      if (req.user.role === USER_ROLES.SUPER_ADMIN) {
        // Find tenant by slug for future use
        const tenant = await Tenant.findOne({ slug: tenantSlug });
        if (tenant) {
          req.tenant = tenant;
        }
        return next();
      }
      
      // Default: deny access if tenant verification failed
      return res.status(403).json({
        success: false,
        message: `Access denied - Not authorized for tenant '${tenantSlug}'`
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Server error during tenant verification',
        error: error.message
      });
    }
  }
};

module.exports = authMiddleware;
