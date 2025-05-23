const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenantController');
const authMiddleware = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../models/users/User');

/**
 * @route POST /api/tenants/register
 * @desc Register a new tenant (school/college)
 * @access Public
 */
router.post('/register', tenantController.registerTenant);

/**
 * @route GET /api/tenants
 * @desc Get all tenants
 * @access Private (Super Admin only)
 */
router.get('/', 
  authMiddleware.protect, 
  authMiddleware.restrictTo([USER_ROLES.SUPER_ADMIN]), 
  tenantController.getAllTenants
);

/**
 * @route GET /api/tenants/:id
 * @desc Get tenant by ID
 * @access Private (Super Admin only)
 */
router.get('/:id', 
  authMiddleware.protect, 
  authMiddleware.restrictTo([USER_ROLES.SUPER_ADMIN]), 
  tenantController.getTenantById
);

/**
 * @route GET /api/tenants/slug/:slug
 * @desc Get tenant by slug
 * @access Public (used for routing)
 */
router.get('/slug/:slug', tenantController.getTenantBySlug);

module.exports = router;
