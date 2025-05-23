const mongoose = require('mongoose');
const { createSchema, applyStandardIndexes } = require('../baseSchema');

// Define gender and status types (matching Supabase enums)
const GENDER_TYPES = {
  MALE: 'male',
  FEMALE: 'female',
  OTHER: 'other',
  PREFER_NOT_TO_SAY: 'prefer_not_to_say'
};

const STATUS_TYPES = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
  GRADUATED: 'graduated',
  SUSPENDED: 'suspended',
  EXPELLED: 'expelled',
  TRANSFERRED: 'transferred',
  ON_LEAVE: 'on_leave'
};

const studentSchema = createSchema({
  // Basic Information
  first_name: {
    type: String,
    required: true,
    trim: true
  },
  middle_name: {
    type: String,
    trim: true
  },
  last_name: {
    type: String,
    required: true,
    trim: true
  },
  roll_number: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  admission_number: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    index: true
  },
  gender: {
    type: String,
    enum: Object.values(GENDER_TYPES),
    required: true
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    index: true
  },
  phone: {
    type: String,
    trim: true
  },
  alternate_phone: {
    type: String,
    trim: true
  },
  
  // Academic Information
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  section: {
    type: String,
    trim: true
  },
  academic_year: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  admission_date: {
    type: Date,
    required: true
  },
  previous_school: {
    type: String,
    trim: true
  },
  
  // Address Information
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      trim: true
    },
    state: {
      type: String,
      trim: true
    },
    country: {
      type: String,
      trim: true,
      default: 'India'
    },
    pincode: {
      type: String,
      trim: true
    }
  },
  
  // Parents/Guardian Information
  parents: [{
    relationship: {
      type: String,
      enum: ['father', 'mother', 'guardian', 'other'],
      required: true
    },
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Parent'
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      trim: true
    },
    occupation: {
      type: String,
      trim: true
    },
    is_primary_contact: {
      type: Boolean,
      default: false
    }
  }],
  
  // Medical Information
  blood_group: {
    type: String,
    trim: true
  },
  medical_conditions: [{
    type: String,
    trim: true
  }],
  allergies: [{
    type: String,
    trim: true
  }],
  medications: [{
    type: String,
    trim: true
  }],
  
  // Additional Information
  profile_image: {
    type: String
  },
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    file_url: {
      type: String,
      required: true
    },
    document_type: {
      type: String,
      required: true,
      trim: true
    },
    uploaded_at: {
      type: Date,
      default: Date.now
    },
    verified: {
      type: Boolean,
      default: false
    }
  }],
  
  // Status Information
  status: {
    type: String,
    enum: Object.values(STATUS_TYPES),
    default: STATUS_TYPES.ACTIVE,
    index: true
  },
  status_updated_at: {
    type: Date
  },
  status_remarks: {
    type: String
  },
  
  // System Information
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  notes: {
    type: String
  },
  additional_fields: {
    type: Map,
    of: mongoose.Schema.Types.Mixed
  }
});

// Apply standard indexes
applyStandardIndexes(studentSchema);

// Additional compound indexes
studentSchema.index({ tenant_id: 1, school_id: 1, class_id: 1, section: 1 });
studentSchema.index({ tenant_id: 1, status: 1, admission_date: 1 });
studentSchema.index({ tenant_id: 1, email: 1, phone: 1 });
studentSchema.index({ 
  tenant_id: 1, 
  first_name: 'text', 
  middle_name: 'text', 
  last_name: 'text',
  roll_number: 'text',
  admission_number: 'text'
});

// Virtual for full name
studentSchema.virtual('full_name').get(function() {
  if (this.middle_name) {
    return `${this.first_name} ${this.middle_name} ${this.last_name}`;
  }
  return `${this.first_name} ${this.last_name}`;
});

// Get age based on date of birth
studentSchema.virtual('age').get(function() {
  if (!this.date_of_birth) return null;
  
  const today = new Date();
  const birthDate = new Date(this.date_of_birth);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
});

const Student = mongoose.model('Student', studentSchema);

module.exports = {
  Student,
  GENDER_TYPES,
  STATUS_TYPES
};
