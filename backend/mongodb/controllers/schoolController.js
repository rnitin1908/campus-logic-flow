const School = require('../models/organization/School');

/**
 * School Controller
 * Handles API endpoints for school management
 */
const schoolController = {
  /**
   * Create a new school
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createSchool: async (req, res) => {
    try {
      const schoolData = req.body;
      
      // Add tenant_id from authenticated user
      schoolData.tenant_id = req.user.tenant_id;

      // Basic validation
      if (!schoolData.name || !schoolData.code) {
        return res.status(400).json({
          success: false,
          message: 'Please provide school name and code'
        });
      }

      // Check if school already exists with same code
      const existingSchool = await School.findOne({
        code: schoolData.code,
        tenant_id: schoolData.tenant_id
      });

      if (existingSchool) {
        return res.status(400).json({
          success: false,
          message: 'School with this code already exists'
        });
      }

      // Add creation metadata
      schoolData.created_by = req.user.id;

      // Create school
      const school = new School(schoolData);
      await school.save();

      res.status(201).json({
        success: true,
        message: 'School created successfully',
        data: school
      });
    } catch (error) {
      console.error('Error creating school:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error creating school',
        error: error.message
      });
    }
  },

  /**
   * Get all schools with pagination and filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSchools: async (req, res) => {
    try {
      // Extract query parameters
      const { 
        page = 1, 
        limit = 10, 
        status, 
        search,
        sortBy = 'name',
        sortOrder = 'asc'
      } = req.query;

      // Get tenant_id from authenticated user
      const tenant_id = req.user.tenant_id;
      console.log("tenant_id",req.user);

      // Build query
      const query = {
        // tenant_id,
        is_deleted: false
      };
      if(req.user.role !== 'super_admin'){
        query.tenant_id = tenant_id;
      }

      // Apply status filter if provided
      if (status) {
        query.status = status;
      }

      // Apply search filter if provided
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { 'address.city': { $regex: search, $options: 'i' } },
          { 'address.state': { $regex: search, $options: 'i' } }
        ];
      }

      // Configure sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calculate skip for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query with pagination
      const schools = await School.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await School.countDocuments(query);

      res.status(200).json({
        success: true,
        data: schools,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error getting schools:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving schools',
        error: error.message
      });
    }
  },

  /**
   * Get school by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSchoolById: async (req, res) => {
    try {
      const { id } = req.params;
      const tenant_id = req.user.tenant_id;

      // Get school
      const school = await School.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        });
      }

      res.status(200).json({
        success: true,
        data: school
      });
    } catch (error) {
      console.error('Error getting school:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving school',
        error: error.message
      });
    }
  },

  /**
   * Update school
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateSchool: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const tenant_id = req.user.tenant_id;

      // Check if school exists
      const school = await School.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        });
      }

      // Check if code is being updated and is already in use
      if (updateData.code && updateData.code !== school.code) {
        const existingSchool = await School.findOne({
          code: updateData.code,
          _id: { $ne: id },
          tenant_id
        });

        if (existingSchool) {
          return res.status(400).json({
            success: false,
            message: 'School with this code already exists'
          });
        }
      }

      // Add update metadata
      updateData.updated_by = req.user.id;
      updateData.updated_at = new Date();

      // Update school
      const updatedSchool = await School.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );

      res.status(200).json({
        success: true,
        message: 'School updated successfully',
        data: updatedSchool
      });
    } catch (error) {
      console.error('Error updating school:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error updating school',
        error: error.message
      });
    }
  },

  /**
   * Delete school (soft delete)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteSchool: async (req, res) => {
    try {
      const { id } = req.params;
      const tenant_id = req.user.tenant_id;

      // Check if school exists
      const school = await School.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        });
      }

      // Soft delete
      school.is_deleted = true;
      school.updated_by = req.user.id;
      school.updated_at = new Date();
      await school.save();

      res.status(200).json({
        success: true,
        message: 'School deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting school:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error deleting school',
        error: error.message
      });
    }
  },

  /**
   * Get school by code
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSchoolByCode: async (req, res) => {
    try {
      const { code } = req.params;
      
      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'School code is required'
        });
      }

      const school = await School.findOne({ 
        code: code.toUpperCase()
      });

      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        });
      }

      res.status(200).json({
        success: true,
        data: school
      });
    } catch (error) {
      console.error('Error getting school by code:', error);
      res.status(500).json({
        success: false,
        message: 'Error getting school by code',
        error: error.message
      });
    }
  },

  /**
   * Update school configuration
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateSchoolConfiguration: async (req, res) => {
    try {
      const { code } = req.params;
      const configData = req.body;
      
      // Basic validation
      if (!code) {
        return res.status(400).json({
          success: false,
          message: 'School code is required'
        });
      }

      // Find school
      const school = await School.findOne({ code: code.toUpperCase() });

      if (!school) {
        return res.status(404).json({
          success: false,
          message: 'School not found'
        });
      }

      // Security check: ensure user belongs to this school or is super_admin
      if (req.user.role !== 'super_admin' && req.user.school_id.toString() !== school._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'You are not authorized to update this school'
        });
      }

      // Update allowed fields
      const allowedFields = [
        'name', 'logo_url', 'banner_url', 'contact_info', 'address', 
        'principal', 'settings', 'features_enabled', 'establishment_year',
        'school_type', 'board', 'affiliation_number'
      ];

      const updateData = {};
      
      allowedFields.forEach(field => {
        if (configData[field] !== undefined) {
          updateData[field] = configData[field];
        }
      });

      // Add update metadata
      updateData.updated_by = req.user.id;
      updateData.updated_at = new Date();

      // Update school
      const updatedSchool = await School.findOneAndUpdate(
        { code: code.toUpperCase() },
        { $set: updateData },
        { new: true, runValidators: true }
      );

      res.status(200).json({
        success: true,
        message: 'School configuration updated successfully',
        data: updatedSchool
      });
    } catch (error) {
      console.error('Error updating school configuration:', error);
      res.status(500).json({
        success: false,
        message: 'Error updating school configuration',
        error: error.message
      });
    }
  }
};

module.exports = schoolController;
