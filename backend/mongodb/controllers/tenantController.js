const tenantService = require('../services/tenantService');
const schoolService = require('../services/schoolService');
const authService = require('../services/authService');
const { USER_ROLES } = require('../models/users/User');
const slugify = require('slugify');

/**
 * Tenant Controller
 * Handles API endpoints for tenant management
 */
const tenantController = {
  /**
   * Register a new tenant (school/college)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  registerTenant: async (req, res) => {
    try {
      const {
        schoolName,
        schoolEmail,
        schoolPhone,
        schoolAddress,
        adminName,
        adminEmail,
        adminPassword,
        academicYear
      } = req.body;

      // Validate required fields
      if (!schoolName || !schoolEmail || !schoolPhone || !adminName || !adminEmail || !adminPassword) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Create a unique code for the tenant based on school name
      const tenantCode = slugify(schoolName, {
        lower: true,
        strict: true,
        remove: /[*+~.()'"!:@]/g
      }).substring(0, 30);

      // Create a unique path/slug for the tenant
      const tenantSlug = tenantCode;

      // Check if tenant with same code already exists
      const existingTenant = await tenantService.getTenantByCode(tenantCode);
      if (existingTenant) {
        return res.status(400).json({
          success: false,
          message: 'A school with this name already exists'
        });
      }

      // Check if admin email is already registered
      const existingAdmin = await authService.findUserByEmail(adminEmail);
      if (existingAdmin) {
        return res.status(400).json({
          success: false,
          message: 'This email is already registered'
        });
      }

      // Create the tenant
      const tenant = await tenantService.createTenant({
        name: schoolName,
        code: tenantCode,
        domain: `${tenantSlug}.campuscore.edu`, // Example domain pattern
        slug: tenantSlug,
        status: 'active',
        subscription: {
          plan: 'free', // Default to free plan
          start_date: new Date(),
          end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // 1 year from now
        },
        settings: {
          theme: 'default',
          timezone: 'Asia/Kolkata', // Default for India
          locale: 'en'
        }
      });

      // Create the school under this tenant
      const school = await schoolService.createSchool({
        name: schoolName,
        code: tenantCode.toUpperCase(),
        tenant_id: tenant._id,
        address: schoolAddress || {
          street: '',
          city: '',
          state: '',
          country: 'India',
          pincode: ''
        },
        contact_info: {
          email: schoolEmail,
          phone: schoolPhone,
          website: ''
        },
        status: 'active',
        settings: {
          academic_year: academicYear || new Date().getFullYear() + '-' + (new Date().getFullYear() + 1),
        }
      });

      // Create school admin user
      const admin = await authService.registerUser({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        role: USER_ROLES.SCHOOL_ADMIN,
        tenant_id: tenant._id,
        school_id: school._id,
        account_status: 'active',
        email_verified: true
      });

      // Return success with tenant, school, and admin details
      res.status(201).json({
        success: true,
        message: 'Tenant registered successfully',
        data: {
          tenant: {
            id: tenant._id,
            name: tenant.name,
            code: tenant.code,
            slug: tenant.slug,
            domain: tenant.domain
          },
          school: {
            id: school._id,
            name: school.name
          },
          admin: {
            id: admin._id,
            name: admin.name,
            email: admin.email
          },
          path: `/schools/${tenant.slug}`,
          loginUrl: `/schools/${tenant.slug}/login`
        }
      });
    } catch (error) {
      console.error('Error registering tenant:', error);
      res.status(500).json({
        success: false,
        message: 'Error registering tenant',
        error: error.message
      });
    }
  },

  /**
   * Get all tenants (for super admin)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getAllTenants: async (req, res) => {
    try {
      const tenants = await tenantService.getAllTenants();
      res.status(200).json({
        success: true,
        data: tenants
      });
    } catch (error) {
      console.error('Error getting all tenants:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting all tenants',
        error: error.message
      });
    }
  },

  /**
   * Get tenant by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getTenantById: async (req, res) => {
    try {
      const tenant = await tenantService.getTenantById(req.params.id);
      if (!tenant) {
        return res.status(404).json({
          success: false,
          message: 'Tenant not found'
        });
      }
      res.status(200).json({
        success: true,
        data: tenant
      });
    } catch (error) {
      console.error('Error getting tenant by ID:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting tenant',
        error: error.message
      });
    }
  },

  /**
   * Get tenant by slug
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getTenantBySlug: async (req, res) => {
    try {
      const tenant = await tenantService.getTenantBySlug(req.params.slug);
      if (!tenant) {
        return res.status(404).json({
          success: false,
          message: 'Tenant not found'
        });
      }
      res.status(200).json({
        success: true,
        data: tenant
      });
    } catch (error) {
      console.error('Error getting tenant by slug:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting tenant',
        error: error.message
      });
    }
  }
};

module.exports = tenantController;
