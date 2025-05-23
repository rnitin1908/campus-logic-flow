const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const schoolController = require('../controllers/schoolController');
const { USER_ROLES } = require('../models/users/User');

// Apply authentication middleware to all routes
router.use(authMiddleware.protect);

/**
 * @route   POST /api/schools
 * @desc    Create a new school
 * @access  Private (Admin, Super Admin)
 */
router.post(
  '/',
  authMiddleware.restrictTo(['admin', 'super_admin']),
  schoolController.createSchool
);

/**
 * @route   GET /api/schools
 * @desc    Get all schools with pagination and filtering
 * @access  Private (All authenticated users)
 */
router.get('/',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN
  ]),
  schoolController.getSchools
);

/**
 * @route   GET /api/schools/:id
 * @desc    Get school by ID
 * @access  Private (All authenticated users)
 */
router.get('/:id',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN,
    USER_ROLES.TEACHER
  ]),
  schoolController.getSchoolById
);

/**
 * @route   GET /api/schools/code/:code
 * @desc    Get school by code
 * @access  Public (Used for routing and configuration)
 */
router.get('/code/:code', schoolController.getSchoolByCode);

/**
 * @route   PUT /api/schools/code/:code/configuration
 * @desc    Update school configuration
 * @access  Private (School Admin, Super Admin)
 */
router.put(
  '/code/:code/configuration',
  authMiddleware.restrictTo([USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]),
  schoolController.updateSchoolConfiguration
);

/**
 * @route   PUT /api/schools/:id
 * @desc    Update school
 * @access  Private (Admin, Super Admin)
 */
router.put(
  '/:id',
  authMiddleware.restrictTo(['admin', 'super_admin']),
  schoolController.updateSchool
);

/**
 * @route   DELETE /api/schools/:id
 * @desc    Delete school (soft delete)
 * @access  Private (Super Admin)
 */
router.delete(
  '/:id',
  authMiddleware.restrictTo([USER_ROLES.SUPER_ADMIN]),
  schoolController.deleteSchool
);

module.exports = router;
