const { Student, STATUS_TYPES } = require('../models/students/Student');

/**
 * Student Service
 * Handles student-related operations (CRUD)
 */
const studentService = {
  /**
   * Create a new student
   * @param {Object} studentData - Student data
   * @returns {Object} Newly created student
   */
  async createStudent(studentData) {
    try {
      // Check if student already exists with the same email or admission number
      const existingStudent = await Student.findOne({
        $or: [
          { email: studentData.email },
          { admission_number: studentData.admission_number }
        ],
        tenant_id: studentData.tenant_id
      });

      if (existingStudent) {
        throw new Error('Student with this email or admission number already exists');
      }

      // Create new student
      const student = new Student(studentData);
      await student.save();
      
      return student;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get all students with pagination, filtering, and sorting
   * @param {Object} filters - Filter criteria
   * @param {Object} options - Pagination and sorting options
   * @returns {Object} Students and pagination info
   */
  async getStudents(filters = {}, options = {}) {
    try {
      const { tenant_id, school_id, class_id, section, status, search } = filters;
      const { page = 1, limit = 10, sortBy = 'created_at', sortOrder = 'desc' } = options;

      // Build query
      const query = {
        is_deleted: false
      };

      // Apply tenant filter (required)
      if (tenant_id) {
        query.tenant_id = tenant_id;
      }

      // Apply optional filters
      if (school_id) {
        query.school_id = school_id;
      }

      if (class_id) {
        query.class_id = class_id;
      }

      if (section) {
        query.section = section;
      }

      if (status) {
        query.status = status;
      }

      // Apply search filter if provided
      if (search) {
        query.$or = [
          { first_name: { $regex: search, $options: 'i' } },
          { last_name: { $regex: search, $options: 'i' } },
          { roll_number: { $regex: search, $options: 'i' } },
          { admission_number: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      // Calculate pagination
      const skip = (page - 1) * limit;

      // Sort configuration
      const sort = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      // Execute query with pagination
      const students = await Student.find(query)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .populate('school_id', 'name')
        .populate('class_id', 'name grade_level');

      // Get total count for pagination
      const total = await Student.countDocuments(query);

      return {
        students,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / limit)
        }
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a student by ID
   * @param {string} id - Student ID
   * @param {string} tenant_id - Tenant ID for security
   * @returns {Object} Student document
   */
  async getStudentById(id, tenant_id) {
    try {
      const student = await Student.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      })
      .populate('school_id', 'name address')
      .populate('class_id', 'name grade_level')
      .populate('user_id', 'name email role');

      if (!student) {
        throw new Error('Student not found');
      }

      return student;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get a student by admission number
   * @param {string} admissionNumber - Student admission number
   * @param {string} tenant_id - Tenant ID for security
   * @returns {Object} Student document
   */
  async getStudentByAdmissionNumber(admissionNumber, tenant_id) {
    try {
      const student = await Student.findOne({
        admission_number: admissionNumber,
        tenant_id,
        is_deleted: false
      })
      .populate('school_id', 'name address')
      .populate('class_id', 'name grade_level');

      if (!student) {
        throw new Error('Student not found');
      }

      return student;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update a student
   * @param {string} id - Student ID
   * @param {Object} updateData - Data to update
   * @param {string} tenant_id - Tenant ID for security
   * @returns {Object} Updated student
   */
  async updateStudent(id, updateData, tenant_id) {
    try {
      // Check if student exists
      const student = await Student.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Check if email is being updated and if it's already in use
      if (updateData.email && updateData.email !== student.email) {
        const existingEmail = await Student.findOne({
          email: updateData.email,
          _id: { $ne: id },
          tenant_id
        });

        if (existingEmail) {
          throw new Error('Email is already in use by another student');
        }
      }

      // Check if admission number is being updated and if it's already in use
      if (updateData.admission_number && updateData.admission_number !== student.admission_number) {
        const existingAdmission = await Student.findOne({
          admission_number: updateData.admission_number,
          _id: { $ne: id },
          tenant_id
        });

        if (existingAdmission) {
          throw new Error('Admission number is already in use by another student');
        }
      }

      // Update student
      const updatedStudent = await Student.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      )
      .populate('school_id', 'name address')
      .populate('class_id', 'name grade_level');

      return updatedStudent;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Update student status
   * @param {string} id - Student ID
   * @param {string} status - New status
   * @param {string} remarks - Status change remarks
   * @param {string} tenant_id - Tenant ID for security
   * @returns {Object} Updated student
   */
  async updateStudentStatus(id, status, remarks, tenant_id) {
    try {
      // Validate status
      if (!Object.values(STATUS_TYPES).includes(status)) {
        throw new Error('Invalid status');
      }

      // Check if student exists
      const student = await Student.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Update status
      student.status = status;
      student.status_updated_at = new Date();
      student.status_remarks = remarks || '';

      await student.save();

      return student;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Delete a student (soft delete)
   * @param {string} id - Student ID
   * @param {string} tenant_id - Tenant ID for security
   * @returns {boolean} Success status
   */
  async deleteStudent(id, tenant_id) {
    try {
      // Check if student exists
      const student = await Student.findOne({
        _id: id,
        tenant_id,
        is_deleted: false
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Soft delete by setting is_deleted flag
      student.is_deleted = true;
      await student.save();

      return {
        success: true,
        message: 'Student deleted successfully'
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Permanently delete a student (hard delete)
   * Use with caution - only for admin users
   * @param {string} id - Student ID
   * @param {string} tenant_id - Tenant ID for security
   * @returns {boolean} Success status
   */
  async permanentlyDeleteStudent(id, tenant_id) {
    try {
      // Check if student exists
      const student = await Student.findOne({
        _id: id,
        tenant_id
      });

      if (!student) {
        throw new Error('Student not found');
      }

      // Hard delete
      await Student.findByIdAndDelete(id);

      return {
        success: true,
        message: 'Student permanently deleted'
      };
    } catch (error) {
      throw error;
    }
  },

  /**
   * Get students by class
   * @param {string} classId - Class ID
   * @param {string} tenant_id - Tenant ID for security
   * @returns {Array} Students in the class
   */
  async getStudentsByClass(classId, tenant_id) {
    try {
      const students = await Student.find({
        class_id: classId,
        tenant_id,
        is_deleted: false,
        status: STATUS_TYPES.ACTIVE
      })
      .sort({ roll_number: 1 });

      return students;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Promote students to next class
   * @param {Array} studentIds - Array of student IDs
   * @param {string} newClassId - New class ID
   * @param {string} tenant_id - Tenant ID for security
   * @returns {Object} Promotion results
   */
  async promoteStudents(studentIds, newClassId, tenant_id) {
    try {
      // Update multiple students
      const result = await Student.updateMany(
        {
          _id: { $in: studentIds },
          tenant_id,
          is_deleted: false
        },
        {
          $set: {
            class_id: newClassId,
            updated_at: new Date()
          }
        }
      );

      return {
        success: true,
        message: 'Students promoted successfully',
        count: result.modifiedCount
      };
    } catch (error) {
      throw error;
    }
  }
};

module.exports = studentService;
