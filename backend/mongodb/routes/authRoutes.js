const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../models/users/User');

const router = express.Router();

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);
// Restricted to super admin only for security
router.post('/create-test-users', 
  authMiddleware.protect,
  authMiddleware.restrictTo([USER_ROLES.SUPER_ADMIN]),
  authController.createTestUsers
);

// Protected routes
router.get(
  '/me', 
  authMiddleware.protect, 
  authController.getCurrentUser
);

router.post(
  '/change-password',
  authMiddleware.protect,
  authController.changePassword
);

module.exports = router;
