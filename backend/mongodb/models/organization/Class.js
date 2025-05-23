const mongoose = require('mongoose');
const { createSchema, applyStandardIndexes } = require('../baseSchema');

/**
 * Class Schema
 * Represents a class/grade in a school
 */
const classSchema = createSchema({
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  grade_level: {
    type: Number,
    required: true,
    min: 1,
    max: 12,
    index: true
  },
  sections: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    capacity: {
      type: Number,
      default: 30
    },
    class_teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    room_number: {
      type: String,
      trim: true
    }
  }],
  academic_year: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  subjects: [{
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    is_optional: {
      type: Boolean,
      default: false
    },
    teacher_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  }],
  timetable_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Timetable'
  },
  syllabus_url: {
    type: String
  },
  description: {
    type: String,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived'],
    default: 'active',
    index: true
  },
  created_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updated_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

// Apply standard indexes
applyStandardIndexes(classSchema);

// Additional compound indexes
classSchema.index({ tenant_id: 1, school_id: 1, academic_year: 1 });
classSchema.index({ tenant_id: 1, school_id: 1, grade_level: 1 });
classSchema.index({ tenant_id: 1, school_id: 1, 'sections.class_teacher_id': 1 });
classSchema.index({ tenant_id: 1, 'subjects.teacher_id': 1 });

const Class = mongoose.model('Class', classSchema);

module.exports = Class;
