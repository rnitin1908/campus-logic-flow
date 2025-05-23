const { validationResult } = require('express-validator');

// Middleware to check for validation errors
const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  next();
};

// Common validation schemas
const commonValidations = {
  // User validation
  userValidation: {
    name: {
      in: ['body'],
      notEmpty: true,
      trim: true,
      escape: true,
      errorMessage: 'Name is required'
    },
    email: {
      in: ['body'],
      isEmail: true,
      normalizeEmail: true,
      errorMessage: 'Valid email is required'
    },
    role: {
      in: ['body'],
      isIn: {
        options: [['ADMIN', 'TEACHER', 'STUDENT']],
        errorMessage: 'Invalid role specified'
      }
    }
  },

  // ID validation
  idValidation: {
    id: {
      in: ['params'],
      isUUID: true,
      errorMessage: 'Invalid ID format'
    }
  },

  // Pagination validation
  paginationValidation: {
    page: {
      in: ['query'],
      optional: true,
      isInt: {
        options: { min: 1 },
        errorMessage: 'Page must be a positive integer'
      }
    },
    limit: {
      in: ['query'],
      optional: true,
      isInt: {
        options: { min: 1, max: 100 },
        errorMessage: 'Limit must be between 1 and 100'
      }
    }
  }
};

module.exports = {
  validateRequest,
  commonValidations
};
