const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const Tenant = require('../models/Tenant');
const { validateObjectId } = require('../utils/validation');

/**
 * @route GET /api/tenants
 * @desc Get all tenants
 * @access Private (Super Admin)
 */
router.get('/', authenticateToken(['super_admin']), async (req, res) => {
  try {
    const tenants = await Tenant.find().select('-__v');
    res.json({ success: true, data: tenants });
  } catch (error) {
    console.error('Error fetching tenants:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route GET /api/tenants/:id
 * @desc Get tenant by ID
 * @access Private (Super Admin, School Admin)
 */
router.get('/:id', authenticateToken(['super_admin', 'school_admin']), async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid tenant ID format' });
    }

    const tenant = await Tenant.findById(req.params.id).select('-__v');
    
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    // School admins can only access their own tenant
    if (req.user.role === 'school_admin' && req.user.tenant_id.toString() !== tenant._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to tenant' });
    }

    res.json({ success: true, data: tenant });
  } catch (error) {
    console.error('Error fetching tenant:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route GET /api/tenants/slug/:slug
 * @desc Get tenant by slug
 * @access Public (for tenant identification)
 */
router.get('/slug/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    
    if (!slug) {
      return res.status(400).json({ success: false, message: 'Tenant slug is required' });
    }

    // Case-insensitive search for the slug
    const tenant = await Tenant.findOne({ slug: { $regex: new RegExp(`^${slug}$`, 'i') } }).select('-__v');
    
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    res.json({ success: true, data: tenant });
  } catch (error) {
    console.error('Error fetching tenant by slug:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route POST /api/tenants
 * @desc Create a new tenant
 * @access Private (Super Admin)
 */
router.post('/', authenticateToken(['super_admin']), async (req, res) => {
  try {
    const { name, slug, school_id, domains = [], config = {} } = req.body;

    // Basic validation
    if (!name || !slug || !school_id) {
      return res.status(400).json({ success: false, message: 'Name, slug, and school_id are required' });
    }

    // Check if tenant with same slug already exists
    const existingTenant = await Tenant.findOne({ slug });
    if (existingTenant) {
      return res.status(400).json({ success: false, message: 'Tenant with this slug already exists' });
    }

    const tenant = new Tenant({
      name,
      slug,
      school_id,
      domains,
      config
    });

    await tenant.save();
    res.status(201).json({ success: true, data: tenant });
  } catch (error) {
    console.error('Error creating tenant:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route PUT /api/tenants/:id
 * @desc Update a tenant
 * @access Private (Super Admin, School Admin)
 */
router.put('/:id', authenticateToken(['super_admin', 'school_admin']), async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid tenant ID format' });
    }

    const tenant = await Tenant.findById(req.params.id);
    
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    // School admins can only update their own tenant
    if (req.user.role === 'school_admin' && req.user.tenant_id.toString() !== tenant._id.toString()) {
      return res.status(403).json({ success: false, message: 'Unauthorized access to tenant' });
    }

    // Super admin can update all fields, school admin has restrictions
    const updateData = {};
    const { name, domains, config } = req.body;

    if (name) updateData.name = name;
    if (domains) updateData.domains = domains;
    if (config) updateData.config = { ...tenant.config, ...config };

    // Only super admin can update slug and school_id
    if (req.user.role === 'super_admin') {
      if (req.body.slug) updateData.slug = req.body.slug;
      if (req.body.school_id) updateData.school_id = req.body.school_id;
    }

    const updatedTenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).select('-__v');

    res.json({ success: true, data: updatedTenant });
  } catch (error) {
    console.error('Error updating tenant:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * @route DELETE /api/tenants/:id
 * @desc Delete a tenant
 * @access Private (Super Admin only)
 */
router.delete('/:id', authenticateToken(['super_admin']), async (req, res) => {
  try {
    if (!validateObjectId(req.params.id)) {
      return res.status(400).json({ success: false, message: 'Invalid tenant ID format' });
    }

    const tenant = await Tenant.findById(req.params.id);
    
    if (!tenant) {
      return res.status(404).json({ success: false, message: 'Tenant not found' });
    }

    await Tenant.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Tenant deleted successfully' });
  } catch (error) {
    console.error('Error deleting tenant:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
