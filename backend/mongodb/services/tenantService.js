const Tenant = require('../models/organization/Tenant');
const mongoose = require('mongoose');
const slugify = require('slugify');

/**
 * Tenant Service
 * Handles database operations for tenants
 */
const tenantService = {
  /**
   * Create a new tenant
   * @param {Object} tenantData - Tenant data
   * @returns {Promise<Object>} - Created tenant object
   */
  createTenant: async (tenantData) => {
    try {
      const tenant = new Tenant(tenantData);
      await tenant.save();
      return tenant;
    } catch (error) {
      console.error('Error creating tenant:', error);
      throw error;
    }
  },

  /**
   * Get default tenant or create if doesn't exist
   * @returns {Promise<Object>} - Tenant object
   */
  getOrCreateDefaultTenant: async () => {
    try {
      // Try to find the default tenant
      let defaultTenant = await Tenant.findOne({ code: 'DEFAULT' });
      
      // If default tenant doesn't exist, create it
      if (!defaultTenant) {
        defaultTenant = await tenantService.createTenant({
          name: 'Default Tenant',
          code: 'DEFAULT',
          domain: 'campuscore.edu',
          status: 'active',
          subscription: {
            plan: 'enterprise',
            start_date: new Date(),
            end_date: new Date(new Date().setFullYear(new Date().getFullYear() + 1)) // 1 year from now
          },
          settings: {
            theme: 'default',
            timezone: 'UTC',
            locale: 'en'
          }
        });
      }
      
      return defaultTenant;
    } catch (error) {
      console.error('Error getting or creating default tenant:', error);
      throw error;
    }
  },

  /**
   * Get tenant by ID
   * @param {String} id - Tenant ID
   * @returns {Promise<Object>} - Tenant object
   */
  getTenantById: async (id) => {
    try {
      const tenant = await Tenant.findById(id);
      return tenant;
    } catch (error) {
      console.error('Error getting tenant by ID:', error);
      throw error;
    }
  },

  /**
   * Get tenant by code
   * @param {String} code - Tenant code
   * @returns {Promise<Object>} - Tenant object
   */
  getTenantByCode: async (code) => {
    try {
      const tenant = await Tenant.findOne({ code });
      return tenant;
    } catch (error) {
      console.error('Error getting tenant by code:', error);
      throw error;
    }
  },

  /**
   * Get tenant by slug
   * @param {String} slug - Tenant slug
   * @returns {Promise<Object>} - Tenant object
   */
  getTenantBySlug: async (slug) => {
    try {
      const tenant = await Tenant.findOne({ slug });
      return tenant;
    } catch (error) {
      console.error('Error getting tenant by slug:', error);
      throw error;
    }
  },

  /**
   * Get all tenants
   * @returns {Promise<Array>} - Array of tenant objects
   */
  getAllTenants: async () => {
    try {
      const tenants = await Tenant.find({});
      return tenants;
    } catch (error) {
      console.error('Error getting all tenants:', error);
      throw error;
    }
  },

  /**
   * Update a tenant
   * @param {String} id - Tenant ID
   * @param {Object} tenantData - Updated tenant data
   * @returns {Promise<Object>} - Updated tenant object
   */
  updateTenant: async (id, tenantData) => {
    try {
      const tenant = await Tenant.findByIdAndUpdate(
        id,
        { $set: tenantData },
        { new: true, runValidators: true }
      );
      
      if (!tenant) {
        throw new Error('Tenant not found');
      }
      
      return tenant;
    } catch (error) {
      console.error('Error updating tenant:', error);
      throw error;
    }
  }
};

module.exports = tenantService;
