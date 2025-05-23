import mongoose from 'mongoose';
import { createSchema, BaseDocument, applyStandardIndexes } from '../baseSchema';

export type GenderType = 'male' | 'female' | 'other';
export type BloodGroupType = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
export type StudentStatusType = 'active' | 'inactive' | 'graduated' | 'transferred' | 'suspended' | 'alumni';

export interface IStudent extends BaseDocument {
  user_id: mongoose.Types.ObjectId | string;
  school_id: mongoose.Types.ObjectId | string;
  admission_number: string;
  roll_number: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  full_name: string;
  date_of_birth: Date;
  gender: GenderType;
  contact_number?: string;
  email?: string;
  photo_url?: string;
  current_class_id: mongoose.Types.ObjectId | string;
  current_section?: string;
  admission_date: Date;
  academic_year: string;
  status: StudentStatusType;
  previous_school?: string;
  blood_group?: BloodGroupType;
  address: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
  };
  parents: {
    parent_id: mongoose.Types.ObjectId | string;
    relationship: 'father' | 'mother' | 'guardian';
    is_primary_contact: boolean;
  }[];
  emergency_contacts: {
    name: string;
    relationship: string;
    phone: string;
    email?: string;
    address?: string;
  }[];
  medical_info: {
    allergies?: string[];
    medical_conditions?: string[];
    medications?: string[];
    notes?: string;
  };
  documents: {
    name: string;
    type: string;
    url: string;
    uploaded_at: Date;
  }[];
  achievements?: {
    title: string;
    description: string;
    date: Date;
    certificate_url?: string;
  }[];
  attendance_summary?: {
    present_days: number;
    absent_days: number;
    late_days: number;
    leave_days: number;
    total_days: number;
  };
  identity_numbers?: {
    type: string;
    value: string;
    issued_by?: string;
    issue_date?: Date;
    expiry_date?: Date;
  }[];
  additional_info?: Record<string, any>;
}

const studentSchema = createSchema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  school_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'School',
    required: true,
    index: true
  },
  admission_number: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  roll_number: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
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
  full_name: {
    type: String,
    required: true,
    trim: true
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true
  },
  contact_number: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  photo_url: {
    type: String
  },
  current_class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
    index: true
  },
  current_section: {
    type: String,
    trim: true
  },
  admission_date: {
    type: Date,
    required: true
  },
  academic_year: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'graduated', 'transferred', 'suspended', 'alumni'],
    default: 'active',
    index: true
  },
  previous_school: {
    type: String,
    trim: true
  },
  blood_group: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
  },
  address: {
    line1: {
      type: String,
      required: true,
      trim: true
    },
    line2: {
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
      trim: true
    },
    postal_code: {
      type: String,
      required: true,
      trim: true
    }
  },
  parents: [{
    parent_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    relationship: {
      type: String,
      enum: ['father', 'mother', 'guardian'],
      required: true
    },
    is_primary_contact: {
      type: Boolean,
      default: false
    }
  }],
  emergency_contacts: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    relationship: {
      type: String,
      required: true,
      trim: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    address: {
      type: String,
      trim: true
    }
  }],
  medical_info: {
    allergies: [String],
    medical_conditions: [String],
    medications: [String],
    notes: String
  },
  documents: [{
    name: {
      type: String,
      required: true,
      trim: true
    },
    type: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true
    },
    uploaded_at: {
      type: Date,
      default: Date.now
    }
  }],
  achievements: [{
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      required: true
    },
    certificate_url: {
      type: String
    }
  }],
  attendance_summary: {
    present_days: {
      type: Number,
      default: 0
    },
    absent_days: {
      type: Number,
      default: 0
    },
    late_days: {
      type: Number,
      default: 0
    },
    leave_days: {
      type: Number,
      default: 0
    },
    total_days: {
      type: Number,
      default: 0
    }
  },
  identity_numbers: [{
    type: {
      type: String,
      required: true,
      trim: true
    },
    value: {
      type: String,
      required: true,
      trim: true
    },
    issued_by: {
      type: String,
      trim: true
    },
    issue_date: {
      type: Date
    },
    expiry_date: {
      type: Date
    }
  }],
  additional_info: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
});

// Pre-save middleware to generate full_name
studentSchema.pre('save', function(next) {
  if (this.isModified('first_name') || this.isModified('middle_name') || this.isModified('last_name')) {
    if (this.middle_name) {
      this.full_name = `${this.first_name} ${this.middle_name} ${this.last_name}`;
    } else {
      this.full_name = `${this.first_name} ${this.last_name}`;
    }
  }
  next();
});

// Apply standard indexes
applyStandardIndexes(studentSchema);

// Additional compound indexes
studentSchema.index({ tenant_id: 1, school_id: 1, admission_number: 1 }, { unique: true });
studentSchema.index({ tenant_id: 1, school_id: 1, roll_number: 1, academic_year: 1 }, { unique: true });
studentSchema.index({ tenant_id: 1, current_class_id: 1, current_section: 1 });
studentSchema.index({ tenant_id: 1, school_id: 1, status: 1 });
studentSchema.index({ tenant_id: 1, school_id: 1, academic_year: 1 });
studentSchema.index({ 'parents.parent_id': 1 });

export default mongoose.models.Student || mongoose.model<IStudent>('Student', studentSchema);
