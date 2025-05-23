const mongoose = require('mongoose');
const { createSchema, applyStandardIndexes } = require('../baseSchema');

/**
 * School Schema
 * Represents a school in the system
 */
const schoolSchema = createSchema({
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
    unique: true,
    index: true
  },
  address: {
    street: {
      type: String,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true,
      default: 'India'
    },
    pincode: {
      type: String,
      required: true,
      trim: true
    }
  },
  contact_info: {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    alternate_phone: {
      type: String,
      trim: true
    },
    website: {
      type: String,
      trim: true
    }
  },
  principal: {
    name: {
      type: String,
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
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  establishment_year: {
    type: Number
  },
  school_type: {
    type: String,
    enum: ['primary', 'secondary', 'high_school', 'college', 'university', 'other'],
    default: 'secondary'
  },
  board: {
    type: String,
    enum: ['CBSE', 'ICSE', 'State Board', 'IB', 'IGCSE', 'Other'],
    default: 'CBSE'
  },
  affiliation_number: {
    type: String,
    trim: true
  },
  logo_url: {
    type: String
  },
  banner_url: {
    type: String
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'pending'],
    default: 'active',
    index: true
  },
  settings: {
    academic_year: {
      type: String,
      trim: true
    },
    current_term: {
      type: String,
      trim: true
    },
    grading_system: {
      type: String,
      enum: ['percentage', 'gpa', 'letter_grade', 'custom'],
      default: 'percentage'
    },
    attendance_type: {
      type: String,
      enum: ['daily', 'subject_wise'],
      default: 'daily'
    },
    working_days: [{
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'],
      default: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    }],
    school_timing: {
      start_time: {
        type: String,
        default: '08:00'
      },
      end_time: {
        type: String,
        default: '15:00'
      }
    },
    sms_notifications: {
      type: Boolean,
      default: false
    },
    email_notifications: {
      type: Boolean,
      default: true
    }
  },
  features_enabled: {
    online_admission: {
      type: Boolean,
      default: true
    },
    online_fee_payment: {
      type: Boolean,
      default: true
    },
    parent_portal: {
      type: Boolean,
      default: true
    },
    student_portal: {
      type: Boolean,
      default: true
    },
    teacher_portal: {
      type: Boolean,
      default: true
    },
    library_management: {
      type: Boolean,
      default: true
    },
    transport_management: {
      type: Boolean,
      default: true
    },
    hostel_management: {
      type: Boolean,
      default: false
    },
    inventory_management: {
      type: Boolean,
      default: false
    }
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
applyStandardIndexes(schoolSchema);

// Additional compound indexes
schoolSchema.index({ tenant_id: 1, name: 1, status: 1 });
schoolSchema.index({ tenant_id: 1, 'contact_info.email': 1 });
schoolSchema.index({ tenant_id: 1, 'contact_info.phone': 1 });
schoolSchema.index({ 
  tenant_id: 1, 
  name: 'text', 
  code: 'text',
  'address.city': 'text',
  'address.state': 'text'
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;
