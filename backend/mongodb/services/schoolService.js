const School = require('../models/organization/School');
const mongoose = require('mongoose');

/**
 * School Service
 * Handles database operations for schools
 */
const schoolService = {
  /**
   * Create a new school
   * @param {Object} schoolData - School data
   * @returns {Promise<Object>} - Created school object
   */
  createSchool: async (schoolData) => {
    try {
      const school = new School(schoolData);
      await school.save();
      return school;
    } catch (error) {
      console.error('Error creating school:', error);
      throw error;
    }
  },

  /**
   * Get school by ID
   * @param {String} id - School ID
   * @returns {Promise<Object>} - School object
   */
  getSchoolById: async (id) => {
    try {
      // Handle 'default' as a special case for test users
      if (id === 'default') {
        // Try to find a default school
        const defaultSchool = await School.findOne({ code: 'CCA' });
        if (defaultSchool) {
          return defaultSchool;
        }
        return null;
      }
      
      // Regular ID lookup
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return null;
      }
      
      const school = await School.findById(id);
      return school;
    } catch (error) {
      console.error('Error getting school by ID:', error);
      throw error;
    }
  },

  /**
   * Get school by code
   * @param {String} code - School code
   * @returns {Promise<Object>} - School object
   */
  getSchoolByCode: async (code) => {
    try {
      const school = await School.findOne({ code: code });
      return school;
    } catch (error) {
      console.error('Error getting school by code:', error);
      throw error;
    }
  },

  /**
   * Get all schools
   * @param {Object} options - Query options
   * @returns {Promise<Array>} - Array of school objects
   */
  getSchools: async (options = {}) => {
    try {
      const { 
        tenantId, 
        status, 
        search,
        page = 1,
        limit = 10,
        sortBy = 'name',
        sortOrder = 'asc'
      } = options;
      
      // Build query
      const query = {};
      
      if (tenantId) {
        query.tenant_id = tenantId;
      }
      
      if (status) {
        query.status = status;
      }
      
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } }
        ];
      }
      
      // Calculate pagination
      const skip = (page - 1) * limit;
      
      // Build sort
      const sort = {};
      sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
      
      // Execute query
      const schools = await School.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit);
      
      // Get total count
      const total = await School.countDocuments(query);
      
      return {
        data: schools,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      console.error('Error getting schools:', error);
      throw error;
    }
  },

  /**
   * Update a school
   * @param {String} id - School ID
   * @param {Object} schoolData - Updated school data
   * @returns {Promise<Object>} - Updated school object
   */
  updateSchool: async (id, schoolData) => {
    try {
      const school = await School.findByIdAndUpdate(
        id,
        { $set: schoolData },
        { new: true, runValidators: true }
      );
      
      if (!school) {
        throw new Error('School not found');
      }
      
      return school;
    } catch (error) {
      console.error('Error updating school:', error);
      throw error;
    }
  },

  /**
   * Delete a school
   * @param {String} id - School ID
   * @returns {Promise<Boolean>} - True if deleted
   */
  deleteSchool: async (id) => {
    try {
      const result = await School.findByIdAndDelete(id);
      
      if (!result) {
        throw new Error('School not found');
      }
      
      return true;
    } catch (error) {
      console.error('Error deleting school:', error);
      throw error;
    }
  }
};

module.exports = schoolService;
