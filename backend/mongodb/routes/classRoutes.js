const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const classController = require('../controllers/classController');
const { USER_ROLES } = require('../models/users/User');

// Apply authentication middleware to all routes
router.use(authMiddleware.protect);

/**
 * @route   POST /api/classes
 * @desc    Create a new class
 * @access  Private (Admin, Super Admin)
 */
router.post(
  '/',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN
  ]),
  classController.createClass
);

/**
 * @route   GET /api/classes
 * @desc    Get all classes with pagination and filtering
 * @access  Private (All authenticated users)
 */
router.get('/',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN,
    USER_ROLES.TEACHER
  ]),
  classController.getClasses
);

/**
 * @route   GET /api/classes/:id
 * @desc    Get class by ID
 * @access  Private (All authenticated users)
 */
router.get('/:id',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN,
    USER_ROLES.TEACHER,
    USER_ROLES.STUDENT,
    USER_ROLES.PARENT
  ]),
  classController.getClassById
);

/**
 * @route   PUT /api/classes/:id
 * @desc    Update class
 * @access  Private (Admin, Super Admin)
 */
router.put(
  '/:id',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN
  ]),
  classController.updateClass
);

/**
 * @route   DELETE /api/classes/:id
 * @desc    Delete class (soft delete)
 * @access  Private (Super Admin)
 */
router.delete(
  '/:id',
  authMiddleware.restrictTo([USER_ROLES.SUPER_ADMIN]),
  classController.deleteClass
);

/**
 * @route   POST /api/classes/:id/sections
 * @desc    Add section to class
 * @access  Private (Admin, Super Admin)
 */
router.post(
  '/:id/sections',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN
  ]),
  classController.addSection
);

/**
 * @route   POST /api/classes/:id/subjects
 * @desc    Add subject to class
 * @access  Private (Admin, Super Admin)
 */
router.post(
  '/:id/subjects',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN
  ]),
  classController.addSubject
);

/**
 * @route   GET /api/classes/school/:schoolId
 * @desc    Get classes by school
 * @access  Private (All authenticated users)
 */
router.get('/school/:schoolId',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN,
    USER_ROLES.TEACHER,
    USER_ROLES.STUDENT,
    USER_ROLES.PARENT
  ]),
  classController.getClassesBySchool
);

module.exports = router;
