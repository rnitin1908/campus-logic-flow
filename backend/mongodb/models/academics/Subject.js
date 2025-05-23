const mongoose = require('mongoose');
const { createSchema, applyStandardIndexes } = require('../baseSchema');

/**
 * Subject Schema
 * Represents a subject taught in school
 */
const subjectSchema = createSchema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  department: {
    type: String,
    enum: ['science', 'mathematics', 'languages', 'social_studies', 'arts', 'physical_education', 'computer_science', 'other'],
    default: 'other',
    index: true
  },
  credit_hours: {
    type: Number,
    min: 0,
    default: 1
  },
  is_elective: {
    type: Boolean,
    default: false
  },
  grade_levels: [{
    type: Number,
    min: 1,
    max: 12
  }],
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  syllabus_url: {
    type: String
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
applyStandardIndexes(subjectSchema);

// Additional compound indexes
subjectSchema.index({ tenant_id: 1, school_id: 1, code: 1 }, { unique: true });
subjectSchema.index({ tenant_id: 1, school_id: 1, department: 1 });
subjectSchema.index({ 
  tenant_id: 1, 
  name: 'text', 
  code: 'text',
  description: 'text'
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
