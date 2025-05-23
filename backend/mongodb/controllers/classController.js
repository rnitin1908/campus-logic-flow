const Class = require('../models/organization/Class');

/**
 * Class Controller
 * Handles API endpoints for class management
 */
const classController = {
  /**
   * Create a new class
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createClass: async (req, res) => {
    try {
      const classData = req.body;
      
      // Add tenant_id from authenticated user
      classData.tenant_id = req.user.tenant_id;

      // Basic validation
      if (!classData.name || !classData.grade_level || !classData.school_id || !classData.academic_year) {
        return res.status(400).json({
          success: false,
          message: 'Please provide class name, grade level, school ID, and academic year'
        });
      }

      // Add creation metadata
      classData.created_by = req.user.id;

      // Create class
      const classObj = new Class(classData);
      await classObj.save();

      res.status(201).json({
        success: true,
        message: 'Class created successfully',
        data: classObj
      });
    } catch (error) {
      console.error('Error creating class:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error creating class',
        error: error.message
      });
    }
  },

  /**
   * Get all classes with pagination and filtering
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getClasses: async (req, res) => {
    try {
      // Extract query parameters
      const { 
        page = 1, 
        limit = 10, 
        school_id, 
        academic_year,
        grade_level,
        status,
        search,
        sortBy = 'grade_level',
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

      if (academic_year) {
        query.academic_year = academic_year;
      }

      if (grade_level) {
        query.grade_level = parseInt(grade_level);
      }

      if (status) {
        query.status = status;
      }

      // Apply search filter if provided
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      // Configure sort
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Calculate skip for pagination
      const skip = (parseInt(page) - 1) * parseInt(limit);

      // Execute query with pagination
      const classes = await Class.find(query)
        .populate('school_id', 'name code')
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit));

      // Get total count for pagination
      const total = await Class.countDocuments(query);

      res.status(200).json({
        success: true,
        data: classes,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit))
        }
      });
    } catch (error) {
      console.error('Error getting classes:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving classes',
        error: error.message
      });
    }
  },

  /**
   * Get class by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getClassById: async (req, res) => {
    try {
      const { id } = req.params;
      const tenant_id = req.user.tenant_id;

      // Get class
      const classObj = await Class.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      })
      .populate('school_id', 'name code')
      .populate('subjects.subject_id', 'name code')
      .populate('subjects.teacher_id', 'name email')
      .populate('sections.class_teacher_id', 'name email');

      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      res.status(200).json({
        success: true,
        data: classObj
      });
    } catch (error) {
      console.error('Error getting class:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving class',
        error: error.message
      });
    }
  },

  /**
   * Update class
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateClass: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const tenant_id = req.user.tenant_id;

      // Check if class exists
      const classObj = await Class.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Add update metadata
      updateData.updated_by = req.user.id;
      updateData.updated_at = new Date();

      // Update class
      const updatedClass = await Class.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      )
      .populate('school_id', 'name code');

      res.status(200).json({
        success: true,
        message: 'Class updated successfully',
        data: updatedClass
      });
    } catch (error) {
      console.error('Error updating class:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error updating class',
        error: error.message
      });
    }
  },

  /**
   * Delete class (soft delete)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteClass: async (req, res) => {
    try {
      const { id } = req.params;
      const tenant_id = req.user.tenant_id;

      // Check if class exists
      const classObj = await Class.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Soft delete
      classObj.is_deleted = true;
      classObj.updated_by = req.user.id;
      classObj.updated_at = new Date();
      await classObj.save();

      res.status(200).json({
        success: true,
        message: 'Class deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting class:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error deleting class',
        error: error.message
      });
    }
  },

  /**
   * Add section to class
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  addSection: async (req, res) => {
    try {
      const { id } = req.params;
      const sectionData = req.body;
      const tenant_id = req.user.tenant_id;

      // Check if class exists
      const classObj = await Class.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Basic validation
      if (!sectionData.name) {
        return res.status(400).json({
          success: false,
          message: 'Please provide section name'
        });
      }

      // Check if section with same name already exists
      const sectionExists = classObj.sections.some(
        section => section.name.toLowerCase() === sectionData.name.toLowerCase()
      );

      if (sectionExists) {
        return res.status(400).json({
          success: false,
          message: 'Section with this name already exists in this class'
        });
      }

      // Add section
      classObj.sections.push(sectionData);
      classObj.updated_by = req.user.id;
      classObj.updated_at = new Date();
      await classObj.save();

      res.status(200).json({
        success: true,
        message: 'Section added successfully',
        data: classObj
      });
    } catch (error) {
      console.error('Error adding section:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error adding section',
        error: error.message
      });
    }
  },

  /**
   * Add subject to class
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  addSubject: async (req, res) => {
    try {
      const { id } = req.params;
      const subjectData = req.body;
      const tenant_id = req.user.tenant_id;

      // Check if class exists
      const classObj = await Class.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!classObj) {
        return res.status(404).json({
          success: false,
          message: 'Class not found'
        });
      }

      // Basic validation
      if (!subjectData.name && !subjectData.subject_id) {
        return res.status(400).json({
          success: false,
          message: 'Please provide subject name or subject ID'
        });
      }

      // Add subject
      classObj.subjects.push(subjectData);
      classObj.updated_by = req.user.id;
      classObj.updated_at = new Date();
      await classObj.save();

      res.status(200).json({
        success: true,
        message: 'Subject added successfully',
        data: classObj
      });
    } catch (error) {
      console.error('Error adding subject:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error adding subject',
        error: error.message
      });
    }
  },

  /**
   * Get classes by school
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getClassesBySchool: async (req, res) => {
    try {
      const { schoolId } = req.params;
      const { academic_year } = req.query;
      const tenant_id = req.user.tenant_id;

      // Build query
      const query = {
        tenant_id,
        school_id: schoolId,
        is_deleted: false
      };

      if (academic_year) {
        query.academic_year = academic_year;
      }

      // Get classes
      const classes = await Class.find(query)
        .sort({ grade_level: 1, name: 1 })
        .select('name grade_level sections status academic_year');

      res.status(200).json({
        success: true,
        data: classes
      });
    } catch (error) {
      console.error('Error getting classes by school:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving classes',
        error: error.message
      });
    }
  }
};

module.exports = classController;
