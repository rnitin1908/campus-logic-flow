const express = require('express');
const router = express.Router();
const { protect, restrictTo } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../models/users/User');
console.log('In subjectRoutes.js, authMiddleware:', require('../middleware/authMiddleware'));
console.log('In subjectRoutes.js, protect:', protect);
const subjectController = require('../controllers/subjectController');

// Apply authentication middleware to all routes
router.use(protect);

/**
 * @route   POST /api/subjects
 * @desc    Create a new subject
 * @access  Private (Admin, Super Admin)
 */
router.post(
  '/',
  restrictTo([USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]),
  subjectController.createSubject
);

/**
 * @route   GET /api/subjects
 * @desc    Get all subjects with pagination and filtering
 * @access  Private (All authenticated users)
 */
router.get('/', 
  restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN,
    USER_ROLES.TEACHER,
    USER_ROLES.STUDENT,
    USER_ROLES.PARENT
  ]),
  subjectController.getSubjects
);

/**
 * @route   GET /api/subjects/:id
 * @desc    Get subject by ID
 * @access  Private (All authenticated users)
 */
router.get('/:id', 
  restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN,
    USER_ROLES.TEACHER,
    USER_ROLES.STUDENT,
    USER_ROLES.PARENT
  ]),
  subjectController.getSubjectById
);

/**
 * @route   PUT /api/subjects/:id
 * @desc    Update subject
 * @access  Private (Admin, Super Admin)
 */
router.put(
  '/:id',
  restrictTo([USER_ROLES.SUPER_ADMIN, USER_ROLES.SCHOOL_ADMIN]),
  subjectController.updateSubject
);

/**
 * @route   DELETE /api/subjects/:id
 * @desc    Delete subject (soft delete)
 * @access  Private (Super Admin)
 */
router.delete(
  '/:id',
  restrictTo([USER_ROLES.SUPER_ADMIN]),
  subjectController.deleteSubject
);

/**
 * @route   GET /api/subjects/school/:schoolId
 * @desc    Get subjects by school
 * @access  Private (All authenticated users)
 */
router.get('/school/:schoolId', 
  restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN,
    USER_ROLES.TEACHER,
    USER_ROLES.STUDENT,
    USER_ROLES.PARENT
  ]),
  subjectController.getSubjectsBySchool
);

module.exports = router;
