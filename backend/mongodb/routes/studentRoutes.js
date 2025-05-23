const express = require('express');
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../models/users/User');

const router = express.Router();

// Protect all routes
router.use(authMiddleware.protect);

// Create student - Admin and teachers only
router.post(
  '/',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN, 
    USER_ROLES.SCHOOL_ADMIN, 
    USER_ROLES.RECEPTIONIST
  ]),
  studentController.createStudent
);

// Get all students with pagination, filtering
router.get(
  '/',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN,
    USER_ROLES.TEACHER,
    USER_ROLES.ACCOUNTANT,
    USER_ROLES.LIBRARIAN,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.TRANSPORT_MANAGER
  ]),
  studentController.getStudents
);

// Get student by ID
router.get(
  '/:id',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN,
    USER_ROLES.SCHOOL_ADMIN,
    USER_ROLES.TEACHER,
    USER_ROLES.ACCOUNTANT,
    USER_ROLES.LIBRARIAN,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.TRANSPORT_MANAGER
  ]),
  studentController.getStudentById
);

// Update student
router.put(
  '/:id',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN, 
    USER_ROLES.SCHOOL_ADMIN
  ]),
  studentController.updateStudent
);

// Update student status
router.patch(
  '/:id/status',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN, 
    USER_ROLES.SCHOOL_ADMIN
  ]),
  studentController.updateStudentStatus
);

// Delete student (soft delete)
router.delete(
  '/:id',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN, 
    USER_ROLES.SCHOOL_ADMIN
  ]),
  studentController.deleteStudent
);

// Get students by class
router.get(
  '/class/:classId',
  studentController.getStudentsByClass
);

// Promote students
router.post(
  '/promote',
  authMiddleware.restrictTo([
    USER_ROLES.SUPER_ADMIN, 
    USER_ROLES.SCHOOL_ADMIN
  ]),
  studentController.promoteStudents
);

module.exports = router;
