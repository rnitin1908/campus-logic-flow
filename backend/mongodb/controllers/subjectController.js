const Subject = require('../models/academics/Subject');

/**
 * Subject Controller
 * Handles API endpoints for subject management
 */
const subjectController = {
  /**
   * Create a new subject
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createSubject: async (req, res) => {
    try {
      const subjectData = req.body;
      
      // Add tenant_id from authenticated user
      subjectData.tenant_id = req.user.tenant_id;

      // Basic validation
      if (!subjectData.name || !subjectData.code || !subjectData.school_id) {
        return res.status(400).json({
          success: false,
          message: 'Please provide subject name, code, and school ID'
        });
      }

      // Check if subject already exists with same code for the school
      const existingSubject = await Subject.findOne({
        code: subjectData.code,
        school_id: subjectData.school_id,
        tenant_id: subjectData.tenant_id
      });

      if (existingSubject) {
        return res.status(400).json({
          success: false,
          message: 'Subject with this code already exists in this school'
        });
      }

      // Add creation metadata
      subjectData.created_by = req.user.id;

      // Create subject
      const subject = new Subject(subjectData);
      await subject.save();

      res.status(201).json({
        success: true,
        message: 'Subject created successfully',
        data: subject
      });
    } catch (error) {
      console.error('Error creating subject:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error creating subject',
        error: error.message
      });
    }
  },

  /**
   * Get all subjects with pagination and filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSubjects: async (req, res) => {
    try {
      // Extract query parameters
      const { 
        page = 1, 
        limit = 10, 
        school_id, 
        department,
        is_elective,
        status,
        search,
        sortBy = 'name',
        sortOrder = 'asc'
      } = req.query;

      // Get tenant_id from authenticated user
      const tenant_id = req.user.tenant_id;

      // Build query
      const query = {
        tenant_id,
        is_deleted: false
      };

      // Apply filters if provided
      if (school_id) {
        query.school_id = school_id;
      }

      if (department) {
        query.department = department;
      }

      if (is_elective !== undefined) {
        query.is_elective = is_elective === 'true';
      }

      if (status) {
        query.status = status;
      }

      // Apply search filter if provided
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { code: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Configure sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calculate skip for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query with pagination
      const subjects = await Subject.find(query)
        .populate('school_id', 'name code')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Subject.countDocuments(query);

      res.status(200).json({
        success: true,
        data: subjects,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error getting subjects:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving subjects',
        error: error.message
      });
    }
  },

  /**
   * Get subject by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSubjectById: async (req, res) => {
    try {
      const { id } = req.params;
      const tenant_id = req.user.tenant_id;

      // Get subject
      const subject = await Subject.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      })
      .populate('school_id', 'name code');

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }

      res.status(200).json({
        success: true,
        data: subject
      });
    } catch (error) {
      console.error('Error getting subject:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving subject',
        error: error.message
      });
    }
  },

  /**
   * Update subject
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateSubject: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const tenant_id = req.user.tenant_id;

      // Check if subject exists
      const subject = await Subject.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }

      // Check if code is being updated and is already in use
      if (updateData.code && updateData.code !== subject.code) {
        const school_id = updateData.school_id || subject.school_id;
        
        const existingSubject = await Subject.findOne({
          code: updateData.code,
          school_id,
          _id: { $ne: id },
          tenant_id
        });

        if (existingSubject) {
          return res.status(400).json({
            success: false,
            message: 'Subject with this code already exists in this school'
          });
        }
      }

      // Add update metadata
      updateData.updated_by = req.user.id;
      updateData.updated_at = new Date();

      // Update subject
      const updatedSubject = await Subject.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      )
      .populate('school_id', 'name code');

      res.status(200).json({
        success: true,
        message: 'Subject updated successfully',
        data: updatedSubject
      });
    } catch (error) {
      console.error('Error updating subject:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error updating subject',
        error: error.message
      });
    }
  },

  /**
   * Delete subject (soft delete)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteSubject: async (req, res) => {
    try {
      const { id } = req.params;
      const tenant_id = req.user.tenant_id;

      // Check if subject exists
      const subject = await Subject.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!subject) {
        return res.status(404).json({
          success: false,
          message: 'Subject not found'
        });
      }

      // Soft delete
      subject.is_deleted = true;
      subject.updated_by = req.user.id;
      subject.updated_at = new Date();
      await subject.save();

      res.status(200).json({
        success: true,
        message: 'Subject deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting subject:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error deleting subject',
        error: error.message
      });
    }
  },

  /**
   * Get subjects by school
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getSubjectsBySchool: async (req, res) => {
    try {
      const { schoolId } = req.params;
      const { department, is_elective } = req.query;
      const tenant_id = req.user.tenant_id;

      // Build query
      const query = {
        tenant_id,
        school_id: schoolId,
        is_deleted: false,
        status: 'active'
      };

      if (department) {
        query.department = department;
      }

      if (is_elective !== undefined) {
        query.is_elective = is_elective === 'true';
      }

      // Get subjects
      const subjects = await Subject.find(query)
        .sort({ department: 1, name: 1 })
        .select('name code department credit_hours is_elective grade_levels');

      res.status(200).json({
        success: true,
        data: subjects
      });
    } catch (error) {
      console.error('Error getting subjects by school:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving subjects',
        error: error.message
      });
    }
  }
};

module.exports = subjectController;
