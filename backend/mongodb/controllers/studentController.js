const studentService = require('../services/studentService');

/**
 * Student Controller
 * Handles API endpoints for student management
 */
const studentController = {
  /**
   * Create a new student
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  createStudent: async (req, res) => {
    try {
      const studentData = req.body;
      
      // Add tenant_id from authenticated user
      studentData.tenant_id = req.user.tenant_id;

      // Basic validation
      if (!studentData.first_name || !studentData.last_name || !studentData.email || 
          !studentData.admission_number || !studentData.roll_number || 
          !studentData.class_id || !studentData.school_id) {
        return res.status(400).json({
          success: false,
          message: 'Please provide all required fields'
        });
      }

      // Create student
      const student = await studentService.createStudent(studentData);

      res.status(201).json({
        success: true,
        message: 'Student created successfully',
        data: student
      });
    } catch (error) {
      console.error('Error creating student:', error);
      
      // Handle duplicate error
      if (error.message.includes('already exists')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error creating student',
        error: error.message
      });
    }
  },

  /**
   * Get all students with pagination
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getStudents: async (req, res) => {
    try {
      // Extract filters from query params
      const { 
        school_id, 
        class_id, 
        section, 
        status, 
        search,
        page,
        limit,
        sortBy,
        sortOrder
      } = req.query;

      // Get tenant_id from authenticated user
      const tenant_id = req.user.tenant_id;

      // Build filters
      const filters = {
        tenant_id,
        school_id,
        class_id,
        section,
        status,
        search
      };

      // Build options
      const options = {
        page,
        limit,
        sortBy,
        sortOrder
      };

      // Get students
      const { students, pagination } = await studentService.getStudents(filters, options);

      res.status(200).json({
        success: true,
        data: students,
        pagination
      });
    } catch (error) {
      console.error('Error getting students:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving students',
        error: error.message
      });
    }
  },

  /**
   * Get a student by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getStudentById: async (req, res) => {
    try {
      const { id } = req.params;
      const tenant_id = req.user.tenant_id;

      // Get student
      const student = await studentService.getStudentById(id, tenant_id);

      res.status(200).json({
        success: true,
        data: student
      });
    } catch (error) {
      console.error('Error getting student:', error);
      
      // Handle not found
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error retrieving student',
        error: error.message
      });
    }
  },

  /**
   * Update a student
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateStudent: async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;
      const tenant_id = req.user.tenant_id;

      // Update student
      const student = await studentService.updateStudent(id, updateData, tenant_id);

      res.status(200).json({
        success: true,
        message: 'Student updated successfully',
        data: student
      });
    } catch (error) {
      console.error('Error updating student:', error);
      
      // Handle not found
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      // Handle duplicate error
      if (error.message.includes('already in use')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating student',
        error: error.message
      });
    }
  },

  /**
   * Update student status
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  updateStudentStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status, remarks } = req.body;
      const tenant_id = req.user.tenant_id;

      // Basic validation
      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Please provide status'
        });
      }

      // Update student status
      const student = await studentService.updateStudentStatus(id, status, remarks, tenant_id);

      res.status(200).json({
        success: true,
        message: 'Student status updated successfully',
        data: student
      });
    } catch (error) {
      console.error('Error updating student status:', error);
      
      // Handle not found
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      // Handle invalid status
      if (error.message.includes('Invalid status')) {
        return res.status(400).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error updating student status',
        error: error.message
      });
    }
  },

  /**
   * Delete a student (soft delete)
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  deleteStudent: async (req, res) => {
    try {
      const { id } = req.params;
      const tenant_id = req.user.tenant_id;

      // Delete student
      const result = await studentService.deleteStudent(id, tenant_id);

      res.status(200).json({
        success: true,
        message: 'Student deleted successfully'
      });
    } catch (error) {
      console.error('Error deleting student:', error);
      
      // Handle not found
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message
        });
      }

      res.status(500).json({
        success: false,
        message: 'Error deleting student',
        error: error.message
      });
    }
  },

  /**
   * Get students by class
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  getStudentsByClass: async (req, res) => {
    try {
      const { classId } = req.params;
      const tenant_id = req.user.tenant_id;

      // Get students
      const students = await studentService.getStudentsByClass(classId, tenant_id);

      res.status(200).json({
        success: true,
        data: students
      });
    } catch (error) {
      console.error('Error getting students by class:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error retrieving students',
        error: error.message
      });
    }
  },

  /**
   * Promote students to next class
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   */
  promoteStudents: async (req, res) => {
    try {
      const { studentIds, newClassId } = req.body;
      const tenant_id = req.user.tenant_id;

      // Basic validation
      if (!studentIds || !studentIds.length || !newClassId) {
        return res.status(400).json({
          success: false,
          message: 'Please provide studentIds and newClassId'
        });
      }

      // Promote students
      const result = await studentService.promoteStudents(studentIds, newClassId, tenant_id);

      res.status(200).json({
        success: true,
        message: `${result.count} students promoted successfully`
      });
    } catch (error) {
      console.error('Error promoting students:', error);
      
      res.status(500).json({
        success: false,
        message: 'Error promoting students',
        error: error.message
      });
    }
  }
};

module.exports = studentController;
